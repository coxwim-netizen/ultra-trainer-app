const { requireAuth, json } = require("./_auth");
const { getStore, connectLambda } = require("@netlify/blobs");

const DAILY_LIMIT = Number(process.env.AI_DAILY_LIMIT || 20);
const MIN_INTERVAL_MS = Number(process.env.AI_MIN_INTERVAL_MS || 12000);

async function checkAndTrackUsage(event, userId) {
  try {
    if (typeof connectLambda === "function") {
      connectLambda(event);
    }

    const store = getStore("ai-usage");
    const dayKey = new Date().toISOString().slice(0, 10);
    const key = dayKey + ":" + userId;
    const now = Date.now();

    const existing = await store.get(key, { type: "json" }) || { count: 0, lastRequestAt: 0 };

    if (existing.lastRequestAt && (now - existing.lastRequestAt) < MIN_INTERVAL_MS) {
      const waitMs = MIN_INTERVAL_MS - (now - existing.lastRequestAt);
      return {
        ok: false,
        statusCode: 429,
        body: {
          error: "Rustig aan — wacht even voor je opnieuw de coach vraagt.",
          retryAfterMs: waitMs,
          remaining: Math.max(0, DAILY_LIMIT - existing.count)
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

    await store.setJSON(key, next);

    return {
      ok: true,
      usage: {
        count: next.count,
        remaining: Math.max(0, DAILY_LIMIT - next.count),
        dailyLimit: DAILY_LIMIT
      }
    };
  } catch (err) {
    console.error("[claude] usageGuardError", err && err.stack ? err.stack : err);
    return {
      ok: true,
      usage: {
        count: null,
        remaining: null,
        dailyLimit: DAILY_LIMIT,
        warning: "usage-guard-unavailable"
      }
    };
  }
}

exports.handler = async function(event) {
  const requestId = event.headers["x-nf-request-id"] || event.headers["x-request-id"] || Math.random().toString(36).slice(2);

  if (event.httpMethod !== "POST") {
    console.log("[claude]", requestId, "405 method", event.httpMethod);
    return json(405, { error: "Method not allowed", requestId });
  }

  try {
    const user = await requireAuth(event);
    const userId = user.user_id || user.sub || "unknown";
    const body = JSON.parse(event.body || "{}");
    const maxTokens = Math.min(Math.max(Number(body.max_tokens || 200), 50), 500);
    const messages = Array.isArray(body.messages) ? body.messages : [];

    const usageCheck = await checkAndTrackUsage(event, userId);
    if (!usageCheck.ok) {
      console.warn("[claude]", requestId, "rateLimited", userId, JSON.stringify(usageCheck.body));
      return json(usageCheck.statusCode, Object.assign({}, usageCheck.body, { requestId }));
    }

    console.log("[claude]", requestId, "user", userId, "messages", messages.length, "maxTokens", maxTokens, "remaining", usageCheck.usage.remaining);

    if (!process.env.ANTHROPIC_API_KEY) {
      console.error("[claude]", requestId, "missing ANTHROPIC_API_KEY");
      return json(500, { error: "ANTHROPIC_API_KEY ontbreekt", requestId });
    }

    const model = process.env.ANTHROPIC_MODEL || "claude-haiku-4-5";
    console.log("[claude]", requestId, "model", model);

    const res = await fetch("https://api.anthropic.com/v1/messages", {
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

    const rawText = await res.text();
    let data;
    try {
      data = JSON.parse(rawText);
    } catch (e) {
      console.error("[claude]", requestId, "invalid JSON from Anthropic", rawText.slice(0, 500));
      return json(502, { error: "Ongeldige response van Anthropic", requestId });
    }

    console.log("[claude]", requestId, "anthropicStatus", res.status);

    if (!res.ok) {
      console.error("[claude]", requestId, "anthropicError", JSON.stringify(data).slice(0, 1000));
      return json(res.status, { error: data.error?.message || "Anthropic fout", requestId });
    }

    const preview = data && data.content && data.content[0] && data.content[0].text ? data.content[0].text.slice(0, 120) : "";
    console.log("[claude]", requestId, "successPreview", preview);

    return json(200, Object.assign({}, data, { requestId, usage: usageCheck.usage }));
  } catch (e) {
    console.error("[claude]", requestId, "handlerError", e && e.stack ? e.stack : e);
    return json(e.statusCode || 500, { error: e.message || "Onbekende fout", requestId });
  }
};
