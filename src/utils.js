const fs = require('fs');

function getClientId() {
    const rawData = fs.readFileSync('client_id.json');
    return JSON.parse(rawData);
}

function saveUserCredentials(credentials_json) {
    fs.writeFileSync('user_credentials.json', JSON.stringify(credentials_json));
}

function loadUserCredentials() {
    const rawData = fs.readFileSync('user_credentials.json');
    return JSON.parse(rawData);
}

module.exports = {
    getClientId: getClientId,
    saveUserCredentials: saveUserCredentials,
    loadUserCredentials: loadUserCredentials
}
