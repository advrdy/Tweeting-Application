const express = require("express");
const {
  getUserFeed,
  getFollowing,
  getFollowers,
  getTweetDetails,
  getTweetLikes,
  getTweetReplies,
  getUserTweets,
  postTweet,
  deleteTweet,
} = require("../controllers/tweetController");
const authenticateToken = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/user/tweets/feed", authenticateToken, getUserFeed);

router.get("/user/following", authenticateToken, getFollowing);

router.get("/user/followers", authenticateToken, getFollowers);

router.get("/tweets/:tweetId", authenticateToken, getTweetDetails);

router.get("/tweets/:tweetId/likes", authenticateToken, getTweetLikes);

router.get("/tweets/:tweetId/replies", authenticateToken, getTweetReplies);

router.get("/user/tweets", authenticateToken, getUserTweets);

router.post("/tweets", authenticateToken, postTweet);

router.delete("/tweets/:tweetId", authenticateToken, deleteTweet);

module.exports = router;
