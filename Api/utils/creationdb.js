const { query } = require("./db");
const userTable = `CREATE TABLE IF NOT EXISTS usertable (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255),
  password VARCHAR(255) NOT NULL,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

const projTable = `CREATE TABLE IF NOT EXISTS project (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES usertable(id),
  title VARCHAR(255),
  description TEXT,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

const todoTable = `CREATE TABLE IF NOT EXISTS todo (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES project(id) ON DELETE CASCADE,
  status BOOLEAN,
  description TEXT,
  title VARCHAR(255),
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_date TIMESTAMP,
  deadline_date TIMESTAMP
);


`;
const createTables = async () => {
  try {
    console.log("Creating tables");
    await query(userTable);
    await query(projTable);
    await query(todoTable);
  } catch (e) {
    console.error("Error creating table users", e);
  }
};

createTables();
