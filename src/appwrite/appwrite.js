require("dotenv").config();
const { Client, Databases, Users, Teams } = require("node-appwrite");

const appwriteUrl = process.env.APPWRITE_URL;
const appwriteProjectId = process.env.APPWRITE_PROJECT_ID;
const appwriteApiKey = process.env.APPWRITE_API_KEY;


const client = new Client()
  .setEndpoint(appwriteUrl)
  .setProject(appwriteProjectId)
  .setKey(appwriteApiKey);

const databases = new Databases(client);
const users = new Users(client);
const teams = new Teams(client)

module.exports = { databases, users, teams };
