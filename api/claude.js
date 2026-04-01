const { requireAuth, sendJson, readBody } = require("./_auth");

const DAILY_LIMIT = Number(process.env.AI_DAILY_LIMIT || 20);
const MIN_INTERVAL_MS = Number(process.env.AI_MIN_INTERVAL_MS || 12000);

/*
  Best-effort in-memory limiter.
  This is not durable across cold starts or multiple instances.
  It prevents obvious accidental spam but is not a hard quota system.
*/
const usageMap = new Map();

function dayKey() {
  return new Date().toISOString().slice(0, 10);
}

function checkAndTrackUsage(userId) {
  const key = dayKey() + ":" + userId;
  const now = Date.now();
  const existing = usageMap.get(key) || { count: 0, lastRequestAt: 0 };

  if (existing.lastRequestAt && (now - existing.lastRequestAt) < MIN_INTERVAL_MS) {
    const waitMs = MIN_INTERVAL_MS - (now - existing.lastRequestAt);
    return {
      ok: false,
      statusCode: 429,
      body: {
        error: "Rustig aan — wacht even voor je opnieuw de coach vraagt.",
        retryAfterMs: waitMs,
        remaining: Math.max(0, DAILY_LIMIT - existing.count),
        dailyLimit: DAILY_LIMIT
      }
    };
  }

  if (existing.count >= DAILY_LIMIT) {
    return {
      ok: false,
      statusCode: 429,
      body: {
        error: "Daglimiet bereikt voor AI coach.",
        remaining: 0,
        dailyLimit: DAILY_LIMIT
      }
    };
  }

  const next = {
    count: existing.count + 1,
    lastRequestAt: now,
    updatedAt: new Date(now).toISOString()
  };
  usageMap.set(key, next);

  return {
    ok: true,
    usage: {
      count: next.count,
      remaining: Math.max(0, DAILY_LIMIT - next.count),
      dailyLimit: DAILY_LIMIT,
      mode: "best-effort-memory"
    }
  };
}

module.exports = async function handler(req, res) {
  const requestId = req.headers["x-vercel-id"] || req.headers["x-request-id"] || Math.random().toString(36).slice(2);

  if (req.method !== "POST") {
    return sendJson(res, 405, { error: "Method not allowed", requestId });
  }

  try {
    const user = await requireAuth(req);
    const userId = user.user_id || user.sub || "unknown";
    const body = await readBody(req);
    const maxTokens = Math.min(Math.max(Number(body.max_tokens || 200), 50), 500);
    const messages = Array.isArray(body.messages) ? body.messages : [];

    const usageCheck = checkAndTrackUsage(userId);
    if (!usageCheck.ok) {
      return sendJson(res, usageCheck.statusCode, Object.assign({}, usageCheck.body, { requestId }));
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return sendJson(res, 500, { error: "ANTHROPIC_API_KEY ontbreekt", requestId });
    }

    const model = process.env.ANTHROPIC_MODEL || "claude-haiku-4-5";
    const apiRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        messages
      })
    });

    const rawText = await apiRes.text();
    let data;
    try {
      data = JSON.parse(rawText);
    } catch (e) {
      return sendJson(res, 502, { error: "Ongeldige response van Anthropic", requestId });
    }

    if (!apiRes.ok) {
      return sendJson(res, apiRes.status || 500, {
        error: (data && data.error && data.error.message) || "Anthropic fout",
        requestId
      });
    }

    return sendJson(res, 200, Object.assign({}, data, { requestId, usage: usageCheck.usage }));
  } catch (e) {
    return sendJson(res, e.statusCode || 500, { error: e.message || "Onbekende fout", requestId });
  }
};