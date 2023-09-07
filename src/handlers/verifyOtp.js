// Purpose: Verify OTP sent to the user
const databases = require("../appwrite/appwrite").databases;
const { decode } = require("../utils/encryption/middleware");
const compareDates = require("../utils/compareDates");

const databaseId = process.env.APPWRITE_DATABASE_ID;
const collectionId = process.env.APPWRITE_OTP_COLLECTION_ID;

const verifyOtp = async (req, res) => {
  const currentDate = new Date();

  try {
    const { verificationKey, otp, check } = req.body;

    if (!verificationKey) {
      const response = {
        Status: "Failure",
        Details: "Verification key not provided",
      };
      return res.status(400).json(response);
    }

    if (!check) {
      const response = {
        Status: "Failure",
        Details: "Check not Provided",
      };
      return res.status(400).json(response);
    }

    if (!otp) {
      const response = { Status: "Failure", Details: "OTP not provided" };
      return res.status(400).json(response);
    }

    let decoded;

    try {
      decoded = await decode(verificationKey);
    } catch (error) {
      const response = { Status: "Failure", Details: "Bad Request" };
      return res.status(400).json(response);
    }

    let { otpId, check: checkObj } = JSON.parse(decoded);

    if (checkObj !== check) {
      const response = {
        Status: "Failure",
        Details: "OTP was not sent to this particular email.",
      };
      res.status(400).json(response);
    }

    try {
      const otpDocument = await databases.getDocument(
        databaseId,
        collectionId,
        otpId
      );

      if (otpDocument?.isVerified !== true) {
        const expirationDate = new Date(otpDocument.expirationTime);

        if (compareDates(expirationDate, currentDate) === 1) {
          if (otpDocument.otp === otp) {
            try {
              await databases.updateDocument(databaseId, collectionId, otpId, {
                isVerified: true,
                updatedAt: currentDate,
              });

              const response = {
                Status: "Success",
                Details: "OTP verified successfully",
              };
              return res.status(200).json(response);
            } catch (error) {
              const response = { Status: "Failure", Details: error };
              return res.status(400).json(response);
            }
          } else {
            const response = { Status: "Failure", Details: "OTP not matched" };
            return res.status(400).json(response);
          }
        } else {
          const response = { Status: "Failure", Details: "OTP expired" };
          return res.status(400).json(response);
        }
      } else {
        const response = {
          Status: "Failure",
          Details: "OTP has already been used",
        };
        return res.status(400).json(response);
      }
    } catch (error) {
      const response = { Status: "Failure", Details: error };
      return res.status(400).json(response);
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = verifyOtp;
