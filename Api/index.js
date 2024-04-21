const express = require("express");
const cors = require("cors");
const path = require("path");
const authRouter = require("./Routes/auth");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
