const express = require("express");
const fetch = require("node-fetch");
const app = express();
const port = process.env.PORT || 5000; // You can change the port as needed

app.use(express.json());

app.use("/graphql", async (req, res) => {
  const url = "https://leetcode.com/graphql"; // LeetCode GraphQL endpoint URL

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add any necessary headers here
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Proxy Error:", error);
    res.status(500).json({ error: "Proxy Error" });
  }
});

app.listen(port, () => {
  console.log(`Backend server is running on port ${port}`);
});
