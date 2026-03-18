export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const target = req.url.slice(1); // 去掉开头的 /
  if (!target.startsWith("http")) {
    return res.status(400).send("Bad Request");
  }

  const headers = { ...req.headers };
  delete headers["host"];

  const response = await fetch(target, {
    method: req.method,
    headers,
    body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
  });

  const data = await response.text();
  res.status(response.status).send(data);
}