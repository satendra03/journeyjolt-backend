# ![TOAST UI Editor](https://i.ibb.co/NgkM3VZM/head.jpg)

> Backend for [JourneyJolt](https://github.com/satendra03/trip-planner-by-satendra)

[![ hearth by Satendra](https://img.shields.io/badge/code_with_💖_by-Satendra-blue)](https://github.com/satendra03)


<img src="https://i.ibb.co/zH77j15F/mian.jpg" alt="main-page" />

<br />

# 🌍 Nearby Places API Server

A Node.js + Express server that interacts with **Google Maps APIs** to fetch nearby places, compute distances, get photo URLs, and fetch driving routes.

> 🧑‍💻 Created by Satendra Kumar Parteti
> [LIVE BACKEND URL](https://journeyjolt-backend.onrender.com/)

---

## 🚀 Features

- Get nearby places based on coordinates and type (like hotels, restaurants, etc.)
- Get distance and duration between two locations
- Get an actual photo URL using a photo reference
- Get driving route data (duration, distance, encoded polyline)

---

## 📦 Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/satendra03/journeyjolt-backend.git
cd journeyjolt-backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
  Create a `.env` file in the root of the project and add your Google Maps API key:
```bash
API_KEY=your_google_maps_api_key
```

### 3. Run the server
  The API will be available at `http://localhost:3000`
```bash
npm start
```
---


## API Endpoints

### 1. `GET /api/places`

**Description**: Get nearby places based on latitude, longitude, and optional place type.

**Query Parameters**:
- `lat`: Latitude (required)
- `lng`: Longitude (required)
- `type`: Place type (required, e.g., `restaurant`, `hospital`)

**Example**: `/api/places?lat=23.2&lng&type=hotel`

### 2. `GET /api/getDistance`

**Description**: Get the distance and duration between two locations.

**Query Parameters**:
- `lat1`: Origin latitude (required)
- `lng1`: Origin longitude (required)
- `lat2`: Destination latitude (required)
- `lng2`: Destination longitude (required)

**Example**: `/api/getDistance?lat1=23.2&lng1=79.9&lat2=23.3&lng2=79.8`


### 3. `POST /api/get-route`

**Description**: Get detailed route information between origin and destination including polyline data.

**Request Body**:
```json
{
  "origin": {"latitude": 23.2, "longitude": 79.9},
  "destination": {"latitude": 23.3, "longitude": 79.8}
}
```

### 4. `GET /get-photo-url`

**Description**: Get the actual photo URL using the Google Places API photo reference.

**Query Parameters**:
- `photo_reference`: The photo reference obtained from the `GET /api/places` response (required)
- `max_width`: Maximum width of the photo (optional, default is 400)

**Example**: `/get-photo-url?photo_reference=CnRnAAAAtZaD-sampleReference&max_width=800`

---


## Contact Us

</div>
We’d love to hear from you! Whether you have a question, suggestion, or issue to report, feel free to get in touch with us.

### Ways to Contact Us:

1. **GitHub Issues**: You can open an issue directly on this repository for bugs, feature requests, or general inquiries.
   - [Open an Issue](https://github.com/satendra03/journeyjolt-backend/issues)

2. **Email**: Reach out to us via email at:
   - **satendrakumarparteti.work@gmail.com** 

3. **Social Media**:
   - **Instagram**: [@_satendra_03](https://www.instagram.com/_satendra_03/)
   - **LinkedIn**: [Satendra Kumar Parteti](https://www.linkedin.com/in/connect-satendra/)
4. **Buy Me A Coffee**:
   - **Small Contibution**:  <a href="https://buymeacoffee.com/satendra03" target="_blank"><img src="https://img.shields.io/badge/Buy%20Me%20A%20Coffee-FFDD00.svg?style=for-the-badge&logo=Buy-Me-A-Coffee&logoColor=black"></a>
---

## Keeping the Backend Alive

To keep the backend responsive and prevent it from sleeping (especially on free hosting platforms like Render), **GitHub Actions** is used to ping the server periodically.

- A GitHub Actions workflow is defined in `.github/workflows/keep-alive.yml`.
- This workflow is scheduled to run every 5 minutes using a cron expression.
- It sends a silent `curl` request to the backend URL:  
  `https://journeyjolt-backend.onrender.com/`
- This regular ping ensures the backend stays active and avoids cold starts.

This setup eliminates the need for local cron jobs and leverages GitHub Actions' reliability.

---
