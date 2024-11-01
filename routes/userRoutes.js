const express = require("express");
const { registerUser, loginUser } = require("../controllers/userController");
const checkingThing = require("../middlewares/userMiddleware");

const router = express.Router();

router.post("/register/", checkingThing, registerUser);
router.post("/login/", loginUser);

module.exports = router;
