const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { query } = require("../utils/db");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../..", ".env") });

const checkuser = async (token) => {
  try {
    const userdata = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    return userdata;
  } catch (e) {
    return "failed";
  }
};
router.get("/", async (req, res) => {
  const tokencookie = req.cookies.token;
  const userdata = await checkuser(tokencookie);
  if (userdata === "failed") {
    return res.status(401).json({ message: "Not authorized" });
  }
  const projects = await query("SELECT * FROM project WHERE user_id = $1", [
    userdata.id,
  ]);
  return res.json({ projects, name: userdata.name });
});

router.post("/", async (req, res) => {
  const tokencookie = req.cookies.token;
  const userdata = await checkuser(tokencookie);
  if (userdata === "failed") {
    return res.status(401).json({ message: "Not authorized" });
  }
  const { title, description } = req.body;

  await query(
    "INSERT INTO project (title, description, user_id) VALUES ($1, $2, $3)",
    [title, description, userdata.id]
  );
  const requireddata = await query("SELECT * FROM project WHERE user_id =$1 ", [
    userdata.id,
  ]);

  return res.json({
    message: "Project created",
    id: requireddata[requireddata.length - 1].id,
    title: requireddata[requireddata.length - 1].title,
    description: requireddata[requireddata.length - 1].description,
  });
});

router.put("/", async (req, res) => {
  const tokencookie = req.cookies.token;
  const userdata = await checkuser(tokencookie);
  if (userdata === "failed") {
    return res.status(401).json({ message: "Not authorized" });
  }
  let { title, description, id } = req.body;

  const prevdata = await query("SELECT * FROM project WHERE id = $1", [id]);
  if (title === undefined) {
    title = prevdata[0].title;
  }
  if (description === undefined) {
    description = prevdata[0].description;
  }

  await query("UPDATE project SET title = $1, description = $2 WHERE id = $3", [
    title,
    description,
    id,
  ]);
  return res.json({ message: "Project updated" });
});

router.delete("/", async (req, res) => {
  const tokencookie = req.cookies.token;
  console.log("tokencookie", tokencookie);
  const userdata = await checkuser(tokencookie);
  if (userdata === "failed") {
    return res.status(401).json({ message: "Not authorized" });
  }
  const { id } = req.body;
  await query("DELETE FROM project WHERE id = $1", [id]);
  return res.json({ message: "Project deleted" });
});

module.exports = router;
