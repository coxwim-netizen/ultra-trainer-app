const { requireAuth, json } = require("./_auth");

exports.handler = async function(event) {
  if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed" });

  try {
    await requireAuth(event);

    if (!process.env.STRAVA_CLIENT_ID || !process.env.STRAVA_CLIENT_SECRET) {
      return json(500, { error: "Strava secrets ontbreken in Netlify" });
    }

    const body = JSON.parse(event.body || "{}");
    if (!body.code || !body.redirectUri) {
      return json(400, { error: "code en redirectUri zijn verplicht" });
    }

    const form = new URLSearchParams();
    form.set("client_id", process.env.STRAVA_CLIENT_ID);
    form.set("client_secret", process.env.STRAVA_CLIENT_SECRET);
    form.set("code", body.code);
    form.set("grant_type", "authorization_code");

    const res = await fetch("https://www.strava.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString()
    });

    const data = await res.json();
    if (!res.ok || !data.access_token) {
      return json(res.status || 500, { error: data.message || "Strava token exchange mislukt" });
    }

    return json(200, {
      tokens: {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: data.expires_at
      }
    });
  } catch (e) {
    return json(e.statusCode || 500, { error: e.message || "Onbekende fout" });
  }
};
