# 🌤️ WeatherNow

A professional, real-time weather web application built with HTML, CSS, and JavaScript.

## Features

- 🔍 **City Search** — Search any city worldwide
- 📍 **Geolocation** — "Use My Location" one-click support
- 🌡️ **Current Conditions** — Temperature, feels-like, humidity, wind, UV index, dew point, visibility
- 📅 **5-Day Forecast** — Daily high/low with weather icons
- 🔄 **°C / °F Toggle** — Switch units anytime
- 🎨 **Dynamic Themes** — Background gradient changes with weather (sunny, rainy, stormy, snowy…)
- 📱 **Fully Responsive** — Works on desktop, tablet, and mobile

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (no frameworks)
- **APIs**:
  - [Google Geocoding API](https://developers.google.com/maps/documentation/geocoding) — city → coordinates
  - [Google Weather API](https://developers.google.com/maps/documentation/weather) — weather data

## Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/YOUR_USERNAME/weather-app.git
   cd weather-app
   ```

2. Open `index.html` in your browser — no build step required!

> **Note:** The app uses a Google Cloud API key. Make sure these APIs are enabled in your [Google Cloud Console](https://console.cloud.google.com/):
> - Maps JavaScript API
> - Geocoding API
> - Weather API (New)

## Deployment

This is a **static site** — deploy instantly on [Vercel](https://vercel.com):

1. Push to GitHub
2. Import the repo on Vercel
3. Click **Deploy** — done!

## License

MIT
