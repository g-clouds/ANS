const axios = require('axios');
const DASHBOARD_URL = "http://localhost:4000";

async function narrate(message) {
    try {
        await axios.post(`${DASHBOARD_URL}/log`, { type: 'narration', message });
    } catch (error) { /* Suppress errors */ }
}

async function sendData(from, to, payload) {
    try {
        await axios.post(`${DASHBOARD_URL}/log`, { type: 'data_transfer', from, to, payload });
    } catch (error) { /* Suppress errors */ }
}

async function sendResult(status, message) {
    try {
        await axios.post(`${DASHBOARD_URL}/log`, { type: 'verification_result', status, message });
    } catch (error) { /* Suppress errors */ }
}

module.exports = { narrate, sendData, sendResult };
