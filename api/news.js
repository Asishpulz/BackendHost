export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end(); // Handle CORS preflight
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { apiKey, query, category, pageSize, page, sortBy } = req.body;

  if (!apiKey) {
    return res.status(400).json({ error: "API key is required" });
  }

  let url = "";

  if (query) {
    url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=${sortBy || 'relevancy'}&pageSize=${pageSize || 10}&page=${page || 1}&apiKey=${apiKey}`;
  } else if (category) {
    url = `https://newsapi.org/v2/top-headlines?category=${category}&language=en&pageSize=${pageSize || 10}&page=${page || 1}&apiKey=${apiKey}`;
  } else {
    url = `https://newsapi.org/v2/top-headlines?language=en&pageSize=${pageSize || 10}&page=${page || 1}&apiKey=${apiKey}`;
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch news", details: err.message });
  }
}
