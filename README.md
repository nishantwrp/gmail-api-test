### Gmail API Test
This is a simple application made to test the gmail rest api.

### Setting up

- Create a project in google api console.
- Enable gmail api.
- Conigure the oauth screen to have `http://localhost:8000/google_auth/callback/` as the callback uri.
- Add `https://www.googleapis.com/auth/gmail.compose` to the allowed scopes.
- Download the json file after creating the credentials and place it in the root of this project as `client_id.json`.

### Running

- `npm install`
- `npm start`

### Working

- Go to `localhost:8000/google_auth` and authenticate using google. You'll notice that a `user_credentials.json` file is created after a successful login.

- You can access the `/send_email` endpoint from the swagger view directly to test it's working.
