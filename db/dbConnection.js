const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require("path");

const dbPath = path.join(__dirname, "../twitterClone.db");

const initializeDBAndServer = async () => {
  try {
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    return db;
  } catch (error) {
    console.error(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

const db = initializeDBAndServer();
module.exports = db;
