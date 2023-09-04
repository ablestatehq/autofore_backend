const crypto = require("crypto");

// Get the unique key to encrypt our object
const password = process.env.SECURITY_KEY;

// get the unique initailization vector
const initailization_vector = Buffer.from(process.env.INITIALISATION_VECTOR);

// To be used as salt in encryption and decryption
const ivstring = initailization_vector.toString("hex").slice(0, 16);

/**
 *
 * @param {string} input The string to be hashed.
 * @returns A hashed string of the input.
 */
function sha1(input) {
  return crypto.createHash("sha1").update(input).digest();
}

// Get the secret key for encryption and decryption using the password
function password_derive_bytes(password, salt, iterations, len) {
  let key = Buffer.from(password + salt);
  for (let i = 0; i < iterations; i++) {
    key = sha1(key);
  }

  if (key.length < len) {
    let hx = password_derive_bytes(password, salt, iterations - 1, 20);
    for (let counter = 1; key.length < len; ++counter) {
      key = Buffer.concat([
        key,
        sha1(Buffer.concat([Buffer.from(counter.toString()), hx])),
      ]);
    }
  }

  return Buffer.alloc(len, key);
}

// Encoder
async function encode(string) {
  const key = password_derive_bytes(password, "", 100, 32);
  // Initialize cipher Object to encrypt using AES-256 algorithm
  const cipher = crypto.createCipheriv("aes-256-cbc", key, ivstring);
  const part1 = cipher.update(string, "utf8");
  const part2 = cipher.final();
  const encrypted = Buffer.concat([part1, part2]).toString("base64");
  return encrypted;
}

// Decoder
async function decode(string) {
  const key = password_derive_bytes(password, "", 100, 32);
  // Initalize decipher object to decrypt using AES-256 Algorithm
  let decipher = crypto.createDecipheriv("aes-256-cbc", key, ivstring);
  let decrypted = decipher.update(string, "base64", "utf8");
  decrypted += decipher.final();
  return decrypted;
}

module.exports = { encode, decode };
