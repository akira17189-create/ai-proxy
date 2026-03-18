export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { url: target } = req.query;
  if (!target || !target.startsWith("http")) {
    return res.status(400).send("Bad Request: missing url param");
  }

  // 读取原始请求体
  const rawBody = await new Promise((resolve) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
  });

  const headers = {};
  if (req.headers["content-type"])      headers["content-type"]      = req.headers["content-type"];
  if (req.headers["authorization"])     headers["authorization"]     = req.headers["authorization"];
  if (req.headers["x-api-key"])         headers["x-api-key"]         = req.headers["x-api-key"];
  if (req.headers["anthropic-version"]) headers["anthropic-version"] = req.headers["anthropic-version"];

  try {
    const response = await fetch(target, {
      method: req.method,
      headers,
      body: rawBody.length > 0 ? rawBody : undefined,
    });
    const data = await response.text();
    res.status(response.status).send(data);
  } catch (e) {
    res.status(500).send(e.message);
  }
}
