const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { query } = require("../utils/db");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../..", ".env") });
const { Octokit } = require("@octokit/core");

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});
const checkuser = async (token) => {
  try {
    const userdata = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    return userdata;
  } catch (e) {
    return "failed";
  }
};

router.post("/", async (req, res) => {
  const tokencookie = req.cookies.token;
  const userdata = await checkuser(tokencookie);
  if (userdata === "failed") {
    return res.status(401).json({ message: "Not authorized" });
  }
  let { title, description, todos } = req.body;
  let pendingTodos = [];
  let completedTasks = [];
  let completedTodos = 0;
  for (let i = 0; i < todos.length; i++) {
    if (todos[i].status) {
      completedTasks.push(todos[i].title);
      completedTodos++;
    }
    if (!todos[i].status) {
      pendingTodos.push(todos[i].title);
    }
  }
  let totalTodos = todos.length;
  let markdownContent = `# ${title}

**Summary:** ${completedTodos} / ${totalTodos} completed.

## Pending Tasks
${pendingTodos.map((task) => `- [ ] ${task}`).join("\n")}

## Completed Tasks
${completedTasks.map((task) => `- [x] ${task}`).join("\n")}
`;
  const gistname = `${title}.md`;
  try {
    const response = await octokit.request("POST /gists", {
      description: "Example of a gist",
      public: false,
      files: {
        [gistname]: {
          content: markdownContent,
        },
      },
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
    console.log("Gist created:", response.data.html_url);
    res
      .status(200)
      .json({ message: "Gist created", url: response.data.html_url });
  } catch (error) {
    console.error("Error creating gist:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
module.exports = router;
