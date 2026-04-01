const { json } = require("./_auth");

exports.handler = async function() {
  return json(200, {
    stravaClientId: process.env.STRAVA_CLIENT_ID || ""
  });
};
