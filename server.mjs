import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.disable("x-powered-by");
let corsOptions = {
  origin: "*", // Sensitive
};
app.use(cors(corsOptions));
app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);

app.use(express.json()); // to parse JSON bodies

app.post("/leetcode", async (req, res) => {
  // Input validation (to be implemented based on your requirements)

  try {
    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(req.body), // forward the body from the client request
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Serve static files from the React application
app.use(express.static(path.join(__dirname, "client", "build")));

// Handle React routing, return all requests to React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});
