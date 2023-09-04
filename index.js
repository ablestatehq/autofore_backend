const express = require("express");
const cors = require("cors");
const getOtp = require("./src/handlers/getOtp");
const verifyOtp = require("./src/handlers/verifyOtp");
const isUserRegistered = require("./src/handlers/isUserRegistered");
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.post("/get-otp", getOtp);
app.post("/users/is-registered", isUserRegistered);
app.post("verify-otp", verifyOtp);

app.listen(port, () => {
  console.log(`Example app listening on port  http://localhost:${port}`);
});
