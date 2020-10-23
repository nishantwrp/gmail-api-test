const express = require("express");
const utils = require('./utils');
const { GoogleOAuth } = require('./google_api');

const PORT = 8000;
const CLIENT_ID = utils.getClientId();
const REDIRECT_URL = 'http://localhost:8000/google_auth/callback/';
const SCOPES = ['https://www.googleapis.com/auth/gmail.compose'];

const app = express();
const gauth = new GoogleOAuth(CLIENT_ID, REDIRECT_URL, SCOPES);

app.get('/google_auth', (req, res) => {
  const authUrl = gauth.getAuthorizationUrl();
  res.redirect(authUrl);
});

app.get('/google_auth/callback/', (req, res) => {

});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server started @ http://localhost:${PORT}`);
});
