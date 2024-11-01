const db = require("../db/dbConnection");

const getUserFeed = async (request, response) => {
  const { username } = request;
  const query = `
    SELECT user.username, tweet.tweet, tweet.date_time AS dateTime 
    FROM follower 
    INNER JOIN tweet ON follower.following_user_id = tweet.user_id 
    INNER JOIN user ON tweet.user_id = user.user_id 
    WHERE follower.follower_user_id = (SELECT user_id FROM user WHERE username = '${username}') 
    ORDER BY tweet.date_time DESC LIMIT 4;
  `;
  const tweets = await db.all(query);
  response.send(tweets);
};

const getFollowing = async (request, response) => {
  const { username } = request;
  const query = `
    SELECT name FROM user WHERE user_id IN (
      SELECT following_user_id FROM follower 
      WHERE follower_user_id = (SELECT user_id FROM user WHERE username = '${username}')
    );
  `;
  const following = await db.all(query);
  response.send(following);
};

const getFollowers = async (request, response) => {
  const { username } = request;
  const query = `
    SELECT name FROM user WHERE user_id IN (
      SELECT follower_user_id FROM follower 
      WHERE following_user_id = (SELECT user_id FROM user WHERE username = '${username}')
    );
  `;
  const followers = await db.all(query);
  response.send(followers);
};

const getTweetDetails = async (request, response) => {
  const { tweetId } = request.params;
  const { username } = request;

  const query = `
    SELECT user_id FROM user 
    WHERE user_id IN (
      SELECT following_user_id FROM follower 
      WHERE follower_user_id = (SELECT user_id FROM user WHERE username = '${username}')
    );
  `;
  const result = await db.all(query);
  const followingIds = result.map((user) => user.user_id);

  const tweetQuery = `SELECT user_id FROM tweet WHERE tweet_id = ${tweetId};`;
  const tweetDetails = await db.get(tweetQuery);

  if (followingIds.includes(tweetDetails.user_id)) {
    const finalQuery = `
      SELECT tweet.tweet, 
             (SELECT COUNT(*) FROM like WHERE tweet_id = ${tweetId}) AS likes, 
             (SELECT COUNT(*) FROM reply WHERE tweet_id = ${tweetId}) AS replies, 
             tweet.date_time AS dateTime 
      FROM tweet WHERE tweet_id = ${tweetId};
    `;
    const tweet = await db.get(finalQuery);
    response.send(tweet);
  } else {
    response.status(401).send("Invalid Request");
  }
};

const getTweetLikes = async (request, response) => {
  const { tweetId } = request.params;
  const { username } = request;

  const query = `
    SELECT user_id FROM user 
    WHERE user_id IN (
      SELECT following_user_id FROM follower 
      WHERE follower_user_id = (SELECT user_id FROM user WHERE username = '${username}')
    );
  `;
  const result = await db.all(query);
  const followingIds = result.map((user) => user.user_id);

  const tweetQuery = `SELECT user_id FROM tweet WHERE tweet_id = ${tweetId};`;
  const tweetDetails = await db.get(tweetQuery);

  if (followingIds.includes(tweetDetails.user_id)) {
    const likesQuery = `
      SELECT user.username AS likes 
      FROM user 
      INNER JOIN like ON like.user_id = user.user_id 
      WHERE tweet_id = ${tweetId};
    `;
    const likes = await db.all(likesQuery);
    response.send({ likes: likes.map((like) => like.likes) });
  } else {
    response.status(401).send("Invalid Request");
  }
};

const getTweetReplies = async (request, response) => {
  const { tweetId } = request.params;
  const { username } = request;

  const query = `
    SELECT user_id FROM user 
    WHERE user_id IN (
      SELECT following_user_id FROM follower 
      WHERE follower_user_id = (SELECT user_id FROM user WHERE username = '${username}')
    );
  `;
  const result = await db.all(query);
  const followingIds = result.map((user) => user.user_id);

  const tweetQuery = `SELECT user_id FROM tweet WHERE tweet_id = ${tweetId};`;
  const tweetDetails = await db.get(tweetQuery);

  if (followingIds.includes(tweetDetails.user_id)) {
    const repliesQuery = `
      SELECT user.name, reply.reply 
      FROM user 
      INNER JOIN reply ON reply.user_id = user.user_id 
      WHERE tweet_id = ${tweetId};
    `;
    const replies = await db.all(repliesQuery);
    response.send({ replies });
  } else {
    response.status(401).send("Invalid Request");
  }
};

const getUserTweets = async (request, response) => {
  const { username } = request;
  const query = `
    SELECT tweet.tweet, 
           COALESCE(like_count.like_count, 0) AS likes, 
           COALESCE(reply_count.reply_count, 0) AS replies, 
           tweet.date_time AS dateTime 
    FROM tweet 
    LEFT JOIN (SELECT tweet_id, COUNT(*) AS like_count FROM like GROUP BY tweet_id) AS like_count 
      ON tweet.tweet_id = like_count.tweet_id 
    LEFT JOIN (SELECT tweet_id, COUNT(*) AS reply_count FROM reply GROUP BY tweet_id) AS reply_count 
      ON tweet.tweet_id = reply_count.tweet_id 
    WHERE tweet.user_id = (SELECT user_id FROM user WHERE username = '${username}')
    GROUP BY tweet.tweet_id;
  `;
  const userTweets = await db.all(query);
  response.send(userTweets);
};

const postTweet = async (request, response) => {
  const { tweet } = request.body;
  const { username } = request;
  const query = `
    INSERT INTO tweet (tweet, user_id) 
    VALUES ('${tweet}', (SELECT user_id FROM user WHERE username = '${username}'));
  `;
  await db.run(query);
  response.send("Created a Tweet");
};

const deleteTweet = async (request, response) => {
  const { tweetId } = request.params;
  const { username } = request;

  const tweetQuery = `
    SELECT tweet_id FROM tweet 
    WHERE user_id = (SELECT user_id FROM user WHERE username = '${username}');
  `;
  const tweetIds = await db.all(tweetQuery);
  const tweetIdList = tweetIds.map((tweet) => tweet.tweet_id);

  if (tweetIdList.includes(Number(tweetId))) {
    const deleteQuery = `DELETE FROM tweet WHERE tweet_id = ${tweetId};`;
    await db.run(deleteQuery);
    response.send("Tweet Removed");
  } else {
    response.status(401).send("Invalid Request");
  }
};

module.exports = {
  getUserFeed,
  getFollowing,
  getFollowers,
  getTweetDetails,
  getTweetLikes,
  getTweetReplies,
  getUserTweets,
  postTweet,
  deleteTweet,
};
