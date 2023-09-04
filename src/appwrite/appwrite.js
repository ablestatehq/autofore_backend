require("dotenv").config();
const { Client, Databases } = require("node-appwrite");

const appwriteUrl = process.env.APPWRITE_URL;
const appwriteProjectId = process.env.APPWRITE_PROJECT_ID;
const appwriteApiKey = process.env.APPWRITE_API_KEY;

const client = new Client()
  .setEndpoint(appwriteUrl)
  .setProject(appwriteProjectId)
  .setKey(appwriteApiKey);

const database = new Databases(client);

export { database };
