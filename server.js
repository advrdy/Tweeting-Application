const express = require("express");
const userRoutes = require("./routes/userRoutes");
const tweetRoutes = require("./routes/tweetRoutes");
const db = require("./db/dbConnection");
require("dotenv").config();

const app = express();
app.use(express.json());

app.use("/user", userRoutes);
app.use("/tweets", tweetRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
