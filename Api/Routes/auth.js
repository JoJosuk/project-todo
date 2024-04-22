const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { query } = require("../utils/db");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../..", ".env") });

router.post("/checkusername", async (req, res) => {
  const username = req.body.username;
  const user = await query("SELECT * FROM usertable WHERE username = $1", [
    username,
  ]);
  if (user.length > 0) {
    return res.status(400).json({ message: "Username allready taken" });
  }
  return res.status(200).json({ message: "Username available" });
});

router.post("/register", async (req, res) => {
  const { username, password, name } = req.body;
  console.log(username, password, name);
  const hashedPassword = await bcrypt.hash(password, 10);
  const altuser = await query("SELECT * FROM usertable WHERE username = $1", [
    username,
  ]);
  if (altuser.length > 0) {
    return res.status(400).json({ message: "Username allready taken" });
  }
  try {
    await query(
      "INSERT INTO usertable (username, password, name) VALUES ($1, $2, $3)",
      [username, hashedPassword, name]
    );
    const user = await query("SELECT * FROM usertable WHERE username = $1", [
      username,
    ]);
    const accesstoken = jwt.sign(
      {
        id: user[0].id,
        username: user[0].username,
        name: user[0].name,
      },
      process.env.ACCESS_TOKEN_SECRET
    );
    res.cookie("token", accesstoken, { httpOnly: true });
    return res.json({ message: "User registered" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal server error", error: e });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await query("SELECT * FROM usertable WHERE username = $1", [
    username,
  ]);
  if (user.length === 0) {
    return res.status(400).json({ message: "User not found" });
  }
  if (await bcrypt.compare(password, user[0].password)) {
    const accesstoken = jwt.sign(
      {
        id: user[0].id,
        username: user[0].username,
        name: user[0].name,
      },
      process.env.ACCESS_TOKEN_SECRET
    );

    res.cookie("token", accesstoken, { httpOnly: true });

    return res.json({ message: "User logged in" });
  } else {
    return res.status(400).json({ message: "Invalid password" });
  }
});

module.exports = router;
