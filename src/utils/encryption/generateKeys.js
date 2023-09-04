const crypto = require("crypto");
crypto.randomBytes(32, (error, buffer) => {
  if (error) {
    console.log(error);
    return;
  } else {
    console.log(`Security Key: ${buffer.toString("hex")}`);
  }
});
