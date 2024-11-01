const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db/dbConnection");

const registerUser = async (request, response) => {
  const { username, password, name, gender } = request;
  const hashedPass = await bcrypt.hash(password, 10);
  const addUser = `INSERT INTO user (username, password, name, gender) 
                   VALUES ('${username}', '${hashedPass}', '${name}', '${gender}')`;
  await db.run(addUser);
  response.send("User created successfully");
};

const loginUser = async (request, response) => {
  const { username, password } = request.body;
  const checkQuery = `SELECT * FROM user WHERE username = '${username}';`;
  const user = await db.get(checkQuery);

  if (user === undefined) {
    response.status(400).send("Invalid user");
  } else {
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (isPasswordCorrect) {
      const payload = { username };
      const jwtToken = jwt.sign(payload, process.env.JWT_SECRET);
      response.send({ jwtToken });
    } else {
      response.status(400).send("Invalid password");
    }
  }
};

module.exports = {
  registerUser,
  loginUser,
};
