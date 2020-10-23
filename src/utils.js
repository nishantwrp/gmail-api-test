const fs = require('fs');

function getClientId() {
    const rawData = fs.readFileSync('client_id.json');
    return JSON.parse(rawData);
}

module.exports = {
    getClientId: getClientId
}
