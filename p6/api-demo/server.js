const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.static("public")); // serve frontend files

// Backend route calling free API
app.get("/backend-catfact", async (req, res) => {
  try {
    const response = await axios.get("https://catfact.ninja/fact");
    res.json({ fact: response.data.fact });
  } catch (error) {
    res.status(500).json({ error: "Error fetching cat fact" });
  }
});

// Start server
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
