const { requireAuth, sendJson, readBody } = require("./_auth");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return sendJson(res, 405, { error: "Method not allowed" });

  try {
    await requireAuth(req);

    if (!process.env.STRAVA_CLIENT_ID || !process.env.STRAVA_CLIENT_SECRET) {
      return sendJson(res, 500, { error: "Strava secrets ontbreken in Vercel" });
    }

    const body = await readBody(req);
    if (!body.code || !body.redirectUri) {
      return sendJson(res, 400, { error: "code en redirectUri zijn verplicht" });
    }

    const form = new URLSearchParams();
    form.set("client_id", process.env.STRAVA_CLIENT_ID);
    form.set("client_secret", process.env.STRAVA_CLIENT_SECRET);
    form.set("code", body.code);
    form.set("grant_type", "authorization_code");

    const apiRes = await fetch("https://www.strava.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString()
    });

    const data = await apiRes.json();
    if (!apiRes.ok || !data.access_token) {
      return sendJson(res, apiRes.status || 500, { error: data.message || "Strava token exchange mislukt" });
    }

    return sendJson(res, 200, {
      tokens: {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: data.expires_at
      }
    });
  } catch (e) {
    return sendJson(res, e.statusCode || 500, { error: e.message || "Onbekende fout" });
  }
};