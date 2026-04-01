const { jwtVerify, createRemoteJWKSet } = require("jose");

const projectId = process.env.FIREBASE_PROJECT_ID || "ultra-trail-training-app";
const jwks = createRemoteJWKSet(new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"));

async function requireAuth(req) {
  const authHeader = req.headers.authorization || req.headers.Authorization || "";
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

function sendJson(res, statusCode, body) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

function readBody(req) {
  if (req.body && typeof req.body === "object") return Promise.resolve(req.body);
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", chunk => { data += chunk; });
    req.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (e) {
        reject(new Error("Ongeldige JSON body"));
      }
    });
    req.on("error", reject);
  });
}

module.exports = { requireAuth, sendJson, readBody };