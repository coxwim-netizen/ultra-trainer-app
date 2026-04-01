const { jwtVerify, createRemoteJWKSet } = require("jose");

const projectId = process.env.FIREBASE_PROJECT_ID || "ultra-trail-training-app";
const jwks = createRemoteJWKSet(new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"));

async function requireAuth(event) {
  const authHeader = event.headers.authorization || event.headers.Authorization || "";
  if (!authHeader.startsWith("Bearer ")) {
    const err = new Error("Missing Bearer token");
    err.statusCode = 401;
    throw err;
  }

  const token = authHeader.slice("Bearer ".length);

  try {
    const { payload } = await jwtVerify(token, jwks, {
      issuer: "https://securetoken.google.com/" + projectId,
      audience: projectId
    });

    return payload;
  } catch (e) {
    const err = new Error("Invalid Firebase token");
    err.statusCode = 401;
    throw err;
  }
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store"
    },
    body: JSON.stringify(body)
  };
}

module.exports = { requireAuth, json };
