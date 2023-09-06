require("dotenv").config();
const sendMessage = require("../utils/sendMessage");

const sendOtp = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;
    const message = require("../utils/phoneVerification");
    const phoneMessage = message(otp);
    sendMessage(phoneNumber, phoneMessage)
      .then(() => {
        res
          .status(200)
          .json({ Status: "Success", Details: "OTP successfully sent" });
      })
      .catch((error) =>
        res.status(400).json({ Status: "Failure", Details: error })
      );
  } catch (error) {
    const response = { Status: "Failure", Details: error };
    res.status(400).json(response);
  }
};

module.exports = sendOtp;
