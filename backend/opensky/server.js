import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/api/live-flights", async (req, res) => {
  try {
    // 1) Get OAuth2 token
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("client_id", process.env.OPENSKY_CLIENT_ID);
    params.append("client_secret", process.env.OPENSKY_CLIENT_SECRET);

    const tokenRes = await fetch(
      "https://auth.opensky-network.org/auth/realms/opensky-network/protocol/openid-connect/token",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      }
    );

    if (!tokenRes.ok) {
      const t = await tokenRes.text();
      return res.status(tokenRes.status).json({ error: "Token failed", body: t });
    }

    const tokenData = await tokenRes.json();

    // 2) Call OpenSky with Bearer token
    const response = await fetch("https://opensky-network.org/api/states/all", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: "OpenSky error", body: text });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "OpenSky API error" });
  }
});

app.listen(5000, () => {
  console.log("OpenSky backend running on port 5000");
});
