const { ID, Permission, Role } = require("node-appwrite");
const { teams, users, databases } = require("../appwrite/appwrite");
const customerTeamId = process.env.APPWRITE_CUSTOMER_TEAM_ID;
const adminTeamId = process.env.APPWRITE_ADMIN_TEAM_ID;
const databaseId = process.env.APPWRITE_DATABASE_ID;
const appwriteProfileCollectionId = process.env.APPWRITE_PROFILES_COLLECTION_ID;

const createUser = async (req, res) => {
  const { phone, password, firstName } = req.body;

  if (!phone) {
    const response = {
      Status: "Failure",
      Details: "Phone Number not provided",
    };
    return res.status(400).json(response);
  }

  if (!password) {
    const response = {
      Status: "Failure",
      Details: "Password not provided",
    };

    return res.status(400).json(response);
  }

  if (!firstName) {
    const response = {
      Status: "Failure",
      Details: "First Name not provided",
    };

    return res.status(400).json(response);
  }

  try {
    const user = await users.create(ID.unique(), phone, undefined, password);

    console.log("user: ", user);

    if (user) {
      try {
        const customerMembership = await teams.createMembership(
          customerTeamId,
          [],
          "https://aw2.ablestate.cloud/v1",
          undefined,
          user.$id
        );
        console.log("Customer membership: ", customerMembership);

        const customerProfile = await databases.createDocument(
          databaseId,
          appwriteProfileCollectionId,
          user.$id,
          {
            firstName,
            phoneNumber: phone.slice(0,10),
            userId: user.$id,
          },
          [
            Permission.read(Role.user(user.$id)),
            Permission.read(Role.team(adminTeamId)),
            Permission.update(Role.user(user.$id)),
            Permission.update(Role.team(adminTeamId)),
            Permission.delete(Role.user(user.$id)),
            Permission.delete(Role.team(adminTeamId)),
          ]
        );

        console.log("Customer Profile: ", customerProfile);

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
        console.log("Team membership creation error: ", error);
        const response = {
          Status: "Failure",
          Details: "Error creating customer membership",
        };
        res.status(400).json(response);
      }
    }
  } catch (error) {
    console.log("User creation error: ", error);
    const response = {
      Status: "Failure",
      Details: "Internal server error",
    };
    return res.status(400).json(response);
  }
};

module.exports = createUser;
