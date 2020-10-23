const express = require('express');
const bodyParser = require('body-parser');
const utils = require('./utils');
const { GoogleOAuth, GmailApi } = require('./google_api');

const PORT = 8000;
const CLIENT_ID = utils.getClientId();
const REDIRECT_URL = 'http://localhost:8000/google_auth/callback/';
const SCOPES = ['https://www.googleapis.com/auth/gmail.compose'];

const app = express();
const gauth = new GoogleOAuth(CLIENT_ID, REDIRECT_URL, SCOPES);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/google_auth', (req, res) => {
  const authUrl = gauth.getAuthorizationUrl();
  res.redirect(authUrl);
});

app.get('/google_auth/callback', async (req, res) => {
  const code = req.query.code;
  await gauth.getCredentials(code);
  res.redirect('/');
});

app.post('/send_email', async (req, res) => {
  const { to, subject, message } = req.body;
  const gmailApi = new GmailApi(await gauth.loadCredentials());
  await gmailApi.sendEmail(to, subject, message);
  res.send({
    'message': 'Success'
  });
});

app.get('/', (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server started @ http://localhost:${PORT}`);
});
