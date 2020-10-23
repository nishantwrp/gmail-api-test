const express = require('express');
const bodyParser = require('body-parser');
const utils = require('./utils');
const { GoogleOAuth, GmailApi } = require('./google_api');

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const PORT = 8000;
const CLIENT_ID = utils.getClientId();
const REDIRECT_URL = 'http://localhost:8000/google_auth/callback/';
const SCOPES = ['https://www.googleapis.com/auth/gmail.compose'];

const app = express();
const gauth = new GoogleOAuth(CLIENT_ID, REDIRECT_URL, SCOPES);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       required:
 *         - message
 *       properties:
 *         message:
 *           type: string
 *     Email:
 *       type: object
 *       required:
 *         - to
 *         - subject
 *         - message
 *       properties:
 *         to:
 *           type: string
 *           description: Email address of the recipient.
 *         subject:
 *           type: string
 *           description: Subejct of email to be sent.
 *         message:
 *           type: string
 *           description: Content of the email to be sent.
 */


app.get('/google_auth', (req, res) => {
  const authUrl = gauth.getAuthorizationUrl();
  res.redirect(authUrl);
});

app.get('/google_auth/callback', async (req, res) => {
  const code = req.query.code;
  await gauth.getCredentials(code);
  res.redirect('/');
});

/**
 * @swagger
 * /send_email/:
 *   post:
 *     summary: Sends an email to the address mentioned in the request body. It uses the `user_credentials.json` file that is generated after a user has successfully authenticated going to `/google_auth`.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Email'
 *     responses:
 *       "200":
 *         description: Email Successfully Sent.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       "400":
 *         description: Invalid email address.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       "401":
 *         description: No previous authentication found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 */
app.post('/send_email', async (req, res) => {
  const { to, subject, message } = req.body;
  let credentials;

  try {
    credentials = await gauth.loadCredentials();
  }
  catch {
    res.status(401);
    return res.send({
      'message': 'No previous authentication found. Please authenticate going to localhost:8000/google_auth once and then try again.'
    });
  }

  const gmailApi = new GmailApi(credentials);

  try {
    await gmailApi.sendEmail(to, subject, message);
  }
  catch {
    res.status(400);
    return res.send({
      'message': 'Invalid recipient email address.'
    })
  }

  res.send({
    'message': 'success'
  });
});

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Gmail API Test",
      version: "1.0.0",
      description:
        "This is a simple application made to test the gmail rest api.",
      contact: {
        name: "Nishant Mittal",
        url: "https://nishantwrp.com",
        email: "admin@nishantwrp.com",
      },
    },
    servers: [
      {
        url: "http://localhost:8000/",
      },
    ],
  },
  apis: ["./src/index.js"],
};

const specs = swaggerJsdoc(options);

app.use('/', swaggerUi.serve, swaggerUi.setup(specs));


app.listen(PORT, () => {
  console.log(`Server started @ http://localhost:${PORT}`);
});
