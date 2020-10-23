const axios = require('axios').default;
const utils = require('./utils');

class GoogleOAuth {
    client_id;
    client_secret;
    auth_uri;
    redirect_uri;
    scopes = [];
    OAUTH_TOKEN_URL = 'https://oauth2.googleapis.com/token';

    constructor({ web }, redirect_uri, scopes) {
        this.client_id = web.client_id;
        this.auth_uri = web.auth_uri;
        this.client_secret = web.client_secret;
        this.redirect_uri = redirect_uri;
        this.scopes = scopes;
    }

    _getScopesForGoogleApi() {
        return this.scopes.join(' ');
    }

    getAuthorizationUrl() {
        let currUrl = new URL(this.auth_uri);
        currUrl.searchParams.append('client_id', this.client_id);
        currUrl.searchParams.append('redirect_uri', this.redirect_uri);
        currUrl.searchParams.append('response_type', 'code');
        currUrl.searchParams.append('scope', this._getScopesForGoogleApi());
        currUrl.searchParams.append('access_type', 'offline');
        currUrl.searchParams.append('include_granted_scopes', 'true');
        currUrl.searchParams.append('prompt', 'consent');
        return currUrl.toString();
    }

    async getCredentials(code) {
        const { data } = await axios.post(this.OAUTH_TOKEN_URL, {
            client_id: this.client_id,
            client_secret: this.client_secret,
            code: code,
            grant_type: 'authorization_code',
            redirect_uri: this.redirect_uri
        });
        utils.saveUserCredentials(data);
    }

    async loadCredentials() {
        const { refresh_token } = utils.loadUserCredentials();
        const { data } = await axios.post(this.OAUTH_TOKEN_URL, {
            client_id: this.client_id,
            client_secret: this.client_secret,
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        });
        return data;
    }
}

class GmailApi {
    access_token;
    SEND_EMAIL_URL = 'https://gmail.googleapis.com/gmail/v1/users/me/messages/send';

    constructor(credentials) {
        this.access_token = credentials.access_token;
    }

    _convertToMessageObject(to, subject, message) {
        const mime = [
            "Content-Type: text/plain; charset=\"UTF-8\"\n",
            "MIME-Version: 1.0\n",
            "Content-Transfer-Encoding: 7bit\n",
            "to: ", to, "\n",
            "subject: ", subject, "\n\n",
            message
        ].join('');
        const encodedMail = new Buffer(mime).toString("base64").replace(/\+/g, '-').replace(/\//g, '_');
        return { 'raw': encodedMail };
    }

    async sendEmail(to, subject, message) {
        const { data } = await axios.post(
            this.SEND_EMAIL_URL,
            this._convertToMessageObject(to, subject, message),
            {
                headers: {
                    'Authorization': 'Bearer ' + this.access_token
                }
            }
        );
        return data;
    }
}

module.exports = {
    GoogleOAuth: GoogleOAuth,
    GmailApi: GmailApi
}
