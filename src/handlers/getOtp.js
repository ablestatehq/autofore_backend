require("dotenv").config();
const { databases } = require("../appwrite/appwrite");
const { ID } = require("node-appwrite");
const generateOTP = require("../utils/generateOTP");
const sendMessage = require("../utils/sendMessage");
const addMinutesToDate = require("../utils/addMinutesToDate");
const { encode } = require("../utils/encryption/middleware");

// Destructuring environment variables
const databaseId = process.env.APPWRITE_DATABASE_ID;
const collectionId = process.env.APPWRITE_OTP_COLLECTION_ID;

const getOtp = async (req, res) => {
  try {
    const { phoneNumber, type } = req.body;
    let phoneMessage;

    if (!phoneNumber) {
      const response = {
        Status: "Failure",
        Details: "Phone Number not provided",
      };
      return res.status(400).json(response);
    }

    if (!type) {
      const response = { Status: "Failure", Details: "Type not provided" };
      return res.status(400).json(response);
    }

    const otp = generateOTP();
    const now = new Date();
    const expirationTime = addMinutesToDate(now, 3);

    if (type) {
      if (type === "FORGOT PASSWORD") {
        const message = require("../utils/messages/passwordForget");
        phoneMessage = message(otp);
        console.log("Phone Message: ", phoneMessage);
      } else if (type === "VERIFICATION") {
        const message = require("../utils/messages/phoneVerification");
        phoneMessage = message(otp);
        console.log("Phone Message: ", phoneMessage);
      }
    }

    const otpDocument = await databases.createDocument(
      databaseId,
      collectionId,
      ID.unique(),
      {
        otp: otp,
        updatedAt: now,
        createdAt: now,
        expirationTime: expirationTime,
      }
    );


    let details = {
      timestamp: now,
      check: phoneNumber,
      success: true,
      message: "OTP sent successfully",
      otpId: otpDocument.$id,
    };

    const encoded = await encode(JSON.stringify(details));

    sendMessage(phoneNumber, phoneMessage)
      .then(() => res.status(200).json({ Status: "Success", Details: encoded }))
      .catch((error) =>
        res.status(400).json({ Status: "Failure", Details: error })
      );
  } catch (error) {
    console.log("Error: ", error)
    const response = { Status: "Failure", Details: error };
    res.status(400).json(response);
  }
};

module.exports = getOtp;
