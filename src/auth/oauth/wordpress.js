'use strict';

const superagent = require('superagent');
const Users = require('../users-model.js');
require('dotenv').config();

const API = 'http://localhost:3000';
const WAE =
  'https://public-api.wordpress.com/oauth2/authorize?${process.env.WORDPRESS_CLIENT_ID}&redirect_uri=http://localhost:3000/wordpressAuth&response_type=code';
const TokenEndpoint = process.env.WWP_TOKEN_REQUEST_ENDPOINT;

let authorize = (request) => {
  console.log('(1)', request.query.code);

  return superagent
    .post(WAE)
    .type('form')
    .send({
      code: request.query.code,
      client_id: process.env.WORDPRESS_CLIENT_ID,
      client_secret: process.env.WORDPRESS_CLIENT_SECRET,
      redirect_uri: `${API}/wordpressAuth`,
      grant_type: 'authorization_code',
    })
    .then((response) => {
      let access_token = response.body.access_token;
      console.log('(2)', access_token);
      return access_token;
    })
    .then((token) => {
      console.log(token);
      return superagent
        .set('Authorization', `Bearer ${token}`)
        .then((response) => {
          let user = response.body;
          console.log('(3)', user);
          return user;
        });
    })
    .then((oauthUser) => {
      console.log('(4) Create Our Account');
      return Users.createFromOauth(oauthUser.email);
    })
    .then((actualUser) => {
      return actualUser.generateToken();
    })
    .catch((error) => error);
};

module.exports = authorize;
