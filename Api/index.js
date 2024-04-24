const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");

const authRouter = require("./Routes/auth");
const projectRouter = require("./Routes/project");
const todoRouter = require("./Routes/todo");
const gistRouter = require("./Routes/gist");

const app = express();

app.use(
  cors({
    credentials: true,
    origin: "https://cute-chimera-e2b29a.netlify.app",
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/project", projectRouter);
app.use("/todo", todoRouter);
app.use("/gist", gistRouter);
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
