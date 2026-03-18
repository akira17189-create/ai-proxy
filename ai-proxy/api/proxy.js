export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // req.url 格式: /https://api.openai.com/v1/chat/completions
  const target = req.url.slice(1);
  if (!target.startsWith("http")) {
    return res.status(400).send("Bad Request");
  }

  // 只转发必要的请求头，避免干扰
  const headers = {};
  if (req.headers["content-type"])    headers["content-type"]    = req.headers["content-type"];
  if (req.headers["authorization"])   headers["authorization"]   = req.headers["authorization"];
  if (req.headers["x-api-key"])       headers["x-api-key"]       = req.headers["x-api-key"];
  if (req.headers["anthropic-version"]) headers["anthropic-version"] = req.headers["anthropic-version"];

  const body = req.method !== "GET" && req.method !== "HEAD"
    ? JSON.stringify(req.body)
    : undefined;

  try {
    const response = await fetch(target, {
      method: req.method,
      headers,
      body,
    });

    const data = await response.text();
    res.status(response.status).send(data);
  } catch (e) {
    res.status(500).send(e.message);
  }
}
