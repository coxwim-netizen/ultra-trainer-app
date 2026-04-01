const { requireAuth, sendJson, readBody } = require("./_auth");

async function maybeRefreshTokens(tokens) {
  const now = Math.floor(Date.now() / 1000);

  if (!tokens.expiresAt || now <= (tokens.expiresAt - 300)) {
    return { tokens, refreshed: false };
  }

  if (!process.env.STRAVA_CLIENT_ID || !process.env.STRAVA_CLIENT_SECRET) {
    throw new Error("Strava secrets ontbreken in Vercel");
  }

  const form = new URLSearchParams();
  form.set("client_id", process.env.STRAVA_CLIENT_ID);
  form.set("client_secret", process.env.STRAVA_CLIENT_SECRET);
  form.set("refresh_token", tokens.refreshToken);
  form.set("grant_type", "refresh_token");

  const apiRes = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form.toString()
  });

  const data = await apiRes.json();
  if (!apiRes.ok || !data.access_token) {
    throw new Error(data.message || "Strava refresh mislukt");
  }

  return {
    refreshed: true,
    tokens: {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: data.expires_at
    }
  };
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return sendJson(res, 405, { error: "Method not allowed" });

  try {
    await requireAuth(req);
    const body = await readBody(req);

    if (!body.accessToken || !body.refreshToken) {
      return sendJson(res, 400, { error: "accessToken en refreshToken zijn verplicht" });
    }

    const tokenState = await maybeRefreshTokens({
      accessToken: body.accessToken,
      refreshToken: body.refreshToken,
      expiresAt: Number(body.expiresAt || 0)
    });

    const after = Math.floor(new Date("2026-01-01T00:00:00Z").getTime() / 1000);
    const apiRes = await fetch("https://www.strava.com/api/v3/athlete/activities?per_page=200&after=" + after, {
      headers: {
        Authorization: "Bearer " + tokenState.tokens.accessToken
      }
    });

    const data = await apiRes.json();
    if (!apiRes.ok || !Array.isArray(data)) {
      return sendJson(res, apiRes.status || 500, { error: data.message || "Strava activiteiten ophalen mislukt" });
    }

    return sendJson(res, 200, {
      tokens: tokenState.tokens,
      activities: data
    });
  } catch (e) {
    return sendJson(res, e.statusCode || 500, { error: e.message || "Onbekende fout" });
  }
};