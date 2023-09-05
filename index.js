const express = require("express");
const cors = require("cors");
const sendOtp = require("./src/handlers/sendOtp");
const isUserRegistered = require("./src/handlers/isUserRegistered");
const createUser = require("./src/handlers/createUser")
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.post("/messages/send-otp", sendOtp);
app.post("/users/is-registered", isUserRegistered);
app.post("/users/create", createUser);

app.listen(port, () => {
  console.log(`Example app listening on port  http://localhost:${port}`);
});
