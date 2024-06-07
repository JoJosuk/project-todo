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
router.post("/get", async (req, res) => {
  const tokencookie = req.cookies.token;
  const userdata = await checkuser(tokencookie);
  if (userdata === "failed") {
    return res.status(401).json({ message: "Not authorized" });
  }
  const { project_id } = req.body;
  const todos = await query(
    "SELECT * FROM todo WHERE project_id = $1 and rbin=false",
    [project_id]
  );
  return res.json({ todos });
});

router.post("/", async (req, res) => {
  const tokencookie = req.cookies.token;
  const userdata = await checkuser(tokencookie);
  if (userdata === "failed") {
    return res.status(401).json({ message: "Not authorized" });
  }
  const { title, project_id } = req.body;

  await query(
    "INSERT INTO todo (title, status, project_id, updated_date) VALUES ($1, $2, $3, $4)",
    [title, false, project_id, new Date()]
  );
  const requireddata = await query("SELECT * FROM todo WHERE project_id =$1 ", [
    project_id,
  ]);

  return res.json({
    message: "Todo created",
    id: requireddata[requireddata.length - 1].id,
    title: requireddata[requireddata.length - 1].title,
    status: requireddata[requireddata.length - 1].status,
    updated_date: requireddata[requireddata.length - 1].updated_date,
  });
});

router.put("/", async (req, res) => {
  const tokencookie = req.cookies.token;
  const userdata = await checkuser(tokencookie);
  if (userdata === "failed") {
    return res.status(401).json({ message: "Not authorized" });
  }
  let { title, status, id } = req.body;

  const prevdata = await query("SELECT * FROM todo WHERE id = $1", [id]);
  if (prevdata.length === 0) {
    return res.status(400).json({ message: "Todo not found" });
  }
  if (prevdata[0].status === status) {
    return res.status(400).json({ message: "No change in status" });
  }
  if (title != prevdata[0].title) {
    await query(
      "UPDATE todo SET title = $1,status =$2, updated_date = $3 WHERE id = $4",
      [title, status, new Date(), id]
    );
    return res.json({ message: "Todo updated" });
  }
  await query("UPDATE todo SET status = $1, updated_date = $2 WHERE id = $3", [
    status,
    new Date(),
    id,
  ]);
  return res.json({ message: "Todo updated" });
});
router.put("/status", async (req, res) => {
  const tokencookie = req.cookies.token;
  const userdata = await checkuser(tokencookie);
  if (userdata === "failed") {
    return res.status(401).json({ message: "Not authorized" });
  }
  let { status, id } = req.body;

  const prevdata = await query("SELECT * FROM todo WHERE id = $1", [id]);
  if (prevdata.length === 0) {
    return res.status(400).json({ message: "Todo not found" });
  }
  if (prevdata[0].status === status) {
    return res.status(400).json({ message: "No change in status" });
  }
  await query("UPDATE todo SET status = $1, updated_date = $2 WHERE id = $3", [
    status,
    new Date(),
    id,
  ]);
  return res.json({ message: "Todo updated" });
});

router.delete("/", async (req, res) => {
  const id = req.body.id;
  const prevdata = await query("SELECT * FROM todo WHERE id = $1", [id]);
  if (prevdata.length === 0) {
    return res.status(400).json({ message: "Todo not found" });
  }
  try {
    await query("UPDATE todo SET rbin= true WHERE id = $1", [id]);
    return res.json({ message: "Todo move tp recycle bin" });
  } catch (e) {
    return res.status(400).json({ message: "Todo not moved" });
  }
});

router.get("/rbin", async (req, res) => {
  const tokencookie = req.cookies.token;
  const userdata = await checkuser(tokencookie);

  try {
    let todotable = await query(
      "select * from todo where project_id in (select id from project where user_id= $1) and rbin=true",
      [userdata.id]
    );
    console.log(todotable);
    return res.json({ todotable });
  } catch (e) {
    return res.json({ e });
  }
});

router.put("/restore", async (req, res) => {
  const id = req.body.id;
  try {
    await query("UPDATE todo SET rbin= false WHERE id = $1", [id]);
    return res.json({ message: "Todo move out recycle bin" });
  } catch (e) {
    return res.status(400).json({ message: "Todo not moved" });
  }
});

router.post("/permanent", async (req, res) => {
  const id = req.body.id;
  console.log("id", id);
  try {
    await query("Delete from todo where id = $1", [id]);
    return res.json({ message: "permanently deleted" });
  } catch (e) {
    return res.status(400).json({ message: "not able to permanently delete" });
  }
});
module.exports = router;
