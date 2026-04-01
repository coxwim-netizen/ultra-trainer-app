const { sendJson } = require("./_auth");

module.exports = async function handler(req, res) {
  return sendJson(res, 200, {
    stravaClientId: process.env.STRAVA_CLIENT_ID || ""
  });
};