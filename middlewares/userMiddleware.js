const db = require("../db/dbConnection");

const checkingThing = async (request, response, next) => {
  const { username, password, name, gender } = request.body;
  const checkQuery = `SELECT * FROM user WHERE username = '${username}';`;
  const user = await db.get(checkQuery);

  if (user) {
    return response.status(400).send("User already exists");
  }

  if (password.length < 6) {
    return response.status(400).send("Password is too short");
  }

  request.username = username;
  request.password = password;
  request.name = name;
  request.gender = gender;

  next();
};

module.exports = checkingThing;
