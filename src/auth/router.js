'use strict';

const express = require('express');
const authRouter = express.Router();

const User = require('./users-model.js');
const auth = require('./middleware.js');
const googleAuth = require('./oauth/google.js');
const githubAuth = require('./oauth/github');
const wordpressAuth = require('./oauth/wordpress');

authRouter.post('/signup', (req, res, next) => {
  let user = new User(req.body);
  user
    .save()
    .then((user) => {
      req.token = user.generateToken();
      req.user = user;
      res.set('token', req.token);
      res.cookie('auth', req.token);
      res.send(req.token);
    })
    .catch(next);
});

authRouter.get('/googleAuth', (req, res, next) => {
  googleAuth(req)
    .then((token) => {
      res.status(200).send(token);
    })
    .catch(next);
});

authRouter.get('/githubAuth', (req, res, next) => {
  githubAuth(req)
    .then((token) => {
      res.status(200).send(token);
    })
    .catch(next);
});

authRouter.get('/wordpressAuth', (req, res, next) => {
  wordpressAuth(req)
    .then((token) => {
      res.status(200).send(token);
    })
    .catch(next);
});

authRouter.post('/signin', auth, (req, res, next) => {
  res.cookie('auth', req.token);
  res.send(req.token);
});

module.exports = authRouter;
