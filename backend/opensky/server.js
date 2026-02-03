import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/api/live-flights", async (req, res) => {
  try {
    const response = await fetch(
      "https://opensky-network.org/api/states/all"
    );
    const data = await response.json();

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "OpenSky API error" });
  }
});

app.listen(5000, () => {
  console.log("OpenSky backend running on port 5000");
});
