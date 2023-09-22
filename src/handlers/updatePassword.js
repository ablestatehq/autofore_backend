require("dotenv").config();
const { users } = require("../appwrite/appwrite");
const { Query } = require("node-appwrite");

const updatePassword = async (req, res) => {
  const phoneNumber = req.body.phoneNumber;
  const password = req.body.password;
  const formattedPhone = `${phoneNumber}@autofore.co`;

  console.log("Phone Number: ", phoneNumber)
  console.log("Password: ", password)

  if (!password) {
    const response = {
      Status: "Failure",
      Details: "Password has not been provided",
    };
    res.status(400).json(response);
  }

  try {
    const response = await users.list([Query.equal("email", formattedPhone)]);
    // console.log("response: ", response);

    if (response?.total === 1) {
      const userId = response.users[0]?.$id;

      const user = await users.updatePassword(userId, password);

      if (user) {
        const response = {
          Status: "Success",
          Details: "Password successfully updated",
        };
        res.status(200).json(response);
      }
    } else if (response?.total === 0) {
      // User is not registered
      return res.status(200).json({
        status: "error",
        message: "Phone number is not registered",
        userExists: false,
      });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports = updatePassword;
