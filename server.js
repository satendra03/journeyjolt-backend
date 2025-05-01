// server.js
import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;
const apiKey = process.env.API_KEY;

app.use(cors());

app.get("/api/places", async (req, res) => {
  const { lat, lng, type } = req.query;
  if (!lat || !lng) {
    return res
      .status(400)
      .json({ error: "Missing lat or lng query parameter" });
  }
  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
      {
        params: {
          location: `${lat},${lng}`,
          radius: 5000,
          type: type,
          key: apiKey,
        },
      }
    );


    const arr = response.data.results.map((place) => ({
      id: place.id,
      name: place.name,
      address: place.vicinity,
      rating: place.rating,
      location: {
        latitude: place.geometry.location.lat,
        longitude: place.geometry.location.lng,
      },
      googleMapsUri: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
      photos: place.photos ? place.photos[0].photo_reference : null,
      business_status: place.business_status,
    }));
    const finalArr = arr
      .filter((place) => place.business_status != "CLOSED_PERMANENTLY")
      .slice(0, 8);

    res.json(finalArr);
    // console.log("Final Arr", finalArr);
  } catch (err) {
    res.status(500).json({ error: "API request failed" });
  }
});

app.get("/api/getDistance", async (req, res) => {
  const { lat1, lng1, lat2, lng2 } = req.query;
  if (!lat1 || !lng1 || !lat2 || !lng2) {
    return res.status(400).json({ error: "Missing query parameters" });
  }
  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/distancematrix/json",
      {
        params: {
          origins: `${lat1},${lng1}`,
          destinations: `${lat2},${lng2}`,
          key: apiKey,
        },
      }
    );
    const data = response.data.rows[0].elements[0];
    let info = {
      distance: data.distance.text,
      duration: data.duration.text,
      status: data.status,
    };
    res.json({ info });
  } catch (err) {
    res.status(500).json({ error: "API request failed" });
  }
});

app.post("/api/get-route", async (req, res) => {
  try {
    const { origin, destination } = req.body;

    if (
      !origin ||
      !destination ||
      !origin.latitude ||
      !origin.longitude ||
      !destination.latitude ||
      !destination.longitude
    ) {
      return res
        .status(400)
        .json({ error: "Missing origin or destination coordinates" });
    }

    const url = "https://routes.googleapis.com/directions/v2:computeRoutes";

    const headers = {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask":
        "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline",
    };

    const body = {
      origin: {
        location: { latLng: origin },
      },
      destination: {
        location: { latLng: destination },
      },
      travelMode: "DRIVE",
      routingPreference: "TRAFFIC_AWARE",
      computeAlternativeRoutes: false,
      routeModifiers: {
        avoidTolls: false,
        avoidHighways: false,
        avoidFerries: false,
      },
      languageCode: "en-US",
    };

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();

    res.status(200).json(data.routes[0]);
  } catch (err) {
    console.error("Error fetching route:", err);
    res.status(500).json({ error: "Failed to fetch route" });
  }
});

app.get("/get-photo-url", async (req, res) => {
  const { photoReference } = req.query;

  if (!photoReference) {
    return res.status(400).json({ error: "photoReference is required" });
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${apiKey}`;

    const response = await fetch(url, {
      method: "GET",
      redirect: "manual", // prevent auto-follow to capture redirect URL
    });

    const redirectUrl = response.headers.get("location");

    if (!redirectUrl) {
      return res
        .status(500)
        .json({ error: "No redirect found from Google API" });
    }

    return res.json({ imageUrl: redirectUrl });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch photo URL" });
  }
});

app.get("/", (req, res) => {
  res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Places API Guide</title>
        <style>
          body {
            background: linear-gradient(135deg,rgb(28, 29, 31),rgb(5, 47, 46));
            color: #fff;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 2rem;
            line-height: 1.6;
          }
          .container {
            max-width: 900px;
            margin: auto;
            background: rgba(0,0,0,0.2);
            padding: 2rem;
            border-radius: 16px;
            box-shadow: 0 0 15px rgba(0,0,0,0.2);
          }
          h1 {
            font-size: 2.5rem;
            text-align: center;
          }
        h3 {
        text-align: center;
         }
          h2 {
            margin-top: 2rem;
            color: #fffa;
          }
            #text {
            font-size: 1.1rem;
            text-align: center;
            }
          code {
            background: rgba(255, 255, 255, 0.1);
            padding: 0.2rem 0.4rem;
            border-radius: 5px;
            font-family: monospace;
          }
          .endpoint {
            background: rgba(255, 255, 255, 0.1);
            padding: 1rem;
            border-radius: 10px;
            margin-bottom: 1rem;
          }
          a {
            color: #fff;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🚀 Places API Documentation 🚀</h1>
          <h3>Created by Satendra Kumar Parteti</h3>
  
          <p id="text">Welcome to the Places API! Below are the available endpoints you can use:</p>
  
          <div class="endpoint">
            <h2>📍 <code>GET /api/places</code></h2>
            <p><strong>Description:</strong> Get nearby places based on latitude, longitude, and optional place type.</p>
            <p><strong>Query Parameters:</strong></p>
            <ul>
              <li><code>lat</code>: Latitude (required)</li>
              <li><code>lng</code>: Longitude (required)</li>
              <li><code>type</code>: Place type (optional, e.g. <code>restaurant</code>, <code>hospital</code>)</li>
            </ul>
            <p><strong>Example:</strong> <code>/api/places?lat=23.2&lng=79.9&type=restaurant</code></p>
          </div>
  
          <div class="endpoint">
            <h2>🛣️ <code>GET /api/getDistance</code></h2>
            <p><strong>Description:</strong> Calculates distance and duration between two points.</p>
            <p><strong>Query Parameters:</strong></p>
            <ul>
              <li><code>lat1</code>, <code>lng1</code>: Origin coordinates</li>
              <li><code>lat2</code>, <code>lng2</code>: Destination coordinates</li>
            </ul>
            <p><strong>Example:</strong> <code>/api/getDistance?lat1=23.2&lng1=79.9&lat2=23.3&lng2=80.1</code></p>
          </div>
  
          <div class="endpoint">
            <h2>🗺️ <code>POST /api/get-route</code></h2>
            <p><strong>Description:</strong> Returns route details (duration, distance, polyline) between origin and destination.</p>
            <p><strong>Body (JSON):</strong></p>
  <pre><code>{
    "origin": { "latitude": 23.2, "longitude": 79.9 },
    "destination": { "latitude": 23.3, "longitude": 80.1 }
  }</code></pre>
          </div>
  
          <div class="endpoint">
            <h2>🖼️ <code>GET /get-photo-url</code></h2>
            <p><strong>Description:</strong> Returns the actual photo URL from a Google Places photo reference.</p>
            <p><strong>Query Parameter:</strong> <code>photoReference</code> (required)</p>
            <p><strong>Example:</strong> <code>/get-photo-url?photoReference=XYZ123</code></p>
          </div>
  
          <p style="text-align:center; margin-top:3rem;">🌐 Need help? Visit <a href="https://developers.google.com/maps/documentation" target="_blank">Google Maps API Docs</a></p>
        </div>
      </body>
      </html>
    `);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
