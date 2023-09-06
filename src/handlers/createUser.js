const { ID } = require("node-appwrite");
const { teams, users } = require("../appwrite/appwrite");
const team = process.env.APPWRITE_CUSTOMER_TEAM_ID;

const createUser = async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    const response = {
      Status: "Failure",
      Details: "Phone Number not provided",
    };
    return res.status(400).json(response);
  }

  try {
    const user = await users.create(
      ID.unique(),
      undefined,
      `+256${phone.slice(1)}`
    );

    if (user) {
      try {
        const customerMembership = await teams.createMembership(
          team,
          [],
          "https://autofore.vercel.app",
          undefined,
          user.$id
        );

        if (customerMembership) {
          const response = {
            Status: "Success",
            Details: "User created successfully",
            Data: {
              UserId: user.$id,
              CustomerMembershipId: customerMembership.$id,
            },
          };

          return res.status(200).json(response);
        } else {
          // Delete user
          try {
            await users.delete(user.$id);
            const response = {
              Status: "Failure",
              Details: "Error creating customer membership",
            };
            res.status(400).json(response);
          } catch (error) {
            const response = {
              Status: "Failure",
              Details: "Error creating customer membership",
            };
            res.status(400).json(response);
          }
        }
      } catch (error) {
        const response = {
          Status: "Failure",
          Details: "Error creating customer membership",
        };
        res.status(400).json(response);
      }
    }
  } catch (error) {
    const response = {
      Status: "Failure",
      Details: "Internal server error",
    };
    return res.status(400).json(response);
  }
};

module.exports = createUser;
