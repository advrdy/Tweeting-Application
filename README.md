# Twitter Clone API

A RESTful API for a Twitter-like platform built using Node.js, Express.js, and SQL. This API allows users to register, log in, post tweets, follow other users, view their feeds, and interact with tweets through likes and replies.

## Features

**User Authentication:** Register and log in with secure password hashing using bcrypt and JWT-based authentication.

**Tweet Management:** Post, view, and delete tweets.

**User Interactions:** Like and reply to tweets.

**Follow System:** Follow and view followers.

**Feed System:** View tweets from followed users.

## API Endpoints

### Authentication

Register User: POST /register

Login User: POST /login

### User Actions

Get User Feed: GET /user/feed

Get Following List: GET /user/following

Get Followers List: GET /user/followers

### Tweet Actions

Post Tweet: POST /tweets

Get User Tweets: GET /user/tweets

Get Tweet Details: GET /tweets/:tweetId

Get Tweet Likes: GET /tweets/:tweetId/likes

Get Tweet Replies: GET /tweets/:tweetId/replies

Delete Tweet: DELETE /tweets/:tweetId
