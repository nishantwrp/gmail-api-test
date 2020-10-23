class GoogleOAuth {
    client_id;
    auth_uri;
    redirect_uri;
    scopes = [];

    constructor({ web }, redirect_uri, scopes) {
        this.client_id = web.client_id;
        this.auth_uri = web.auth_uri;
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
}

module.exports = {
    GoogleOAuth: GoogleOAuth
}
