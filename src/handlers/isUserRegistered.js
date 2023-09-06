require("dotenv").config();
const { users } = require("../appwrite/appwrite");
const { Query } = require("node-appwrite");

const isUserRegistered = async (req, res) => {
  const { phone } = req.body;

  try {
    const response = await users.list([
      Query.equal("phone", `+256${phone.slice(1)}`),
    ]);

    if (response?.total === 1) {
      // User is registered
      return res.status(200).json({
        status: "success",
        message: "The phone is already registered",
        userExists: true,
        userId: response?.users[0].$id,
      });
    } else if (response?.total === 0) {
      console.log("here");
      // User is not registered
      return res.status(200).json({
        status: "error",
        message: "Phone number is not registered",
        userExists: false,
        userId: null,
      });
    }
  } catch (error) {
    console.error("Error checking user registration:", error);
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
