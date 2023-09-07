require("dotenv").config();
const { users } = require("../appwrite/appwrite");
const { Query } = require("node-appwrite");

const isUserRegistered = async (req, res) => {
  const phoneNumber = req.body.phoneNumber;
  const formattedPhone = `${phoneNumber}@autofore.com`;

  try {
    const response = await users.list([Query.equal("email", formattedPhone)]);

    if (response?.total === 1) {
      // User is registered
      return res.status(200).json({
        status: "success",
        message: "Phone number is already registered",
        userExists: true,
      });
    } else if (response?.total === 0) {
      // User is not registered
      return res.status(200).json({
        status: "error",
        message: "Phone number is not registered",
        userExists: false,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      data: {
        error: "An unexpected error occurred while checking user registration.",
      },
    });
  }
};

module.exports = isUserRegistered;
