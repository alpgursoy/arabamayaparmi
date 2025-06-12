# Kuş Riski Uygulaması

## Overview
Kuş Riski Uygulaması is a web-based application designed to visualize bird risk levels based on weather conditions, bird population data, and user location. The application uses Leaflet.js for interactive maps and integrates with APIs for weather data and GeoJSON files for geographical information.

## Features
- Interactive map displaying neighborhoods and districts.
- Weather data integration using OpenWeatherMap API.
- Bird risk level calculation based on temperature, wind speed, and bird population.
- User location-based risk assessment.
- Social media sharing and map download functionality.

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/alpgursoy/kusboku.git
   ```
2. Navigate to the project directory:
   ```bash
   cd kusboku
   ```
3. Start a local PHP server:
   ```bash
   php -S localhost:8000 -t /opt/homebrew/var/www/kusboku
   ```

## Usage
1. Open your browser and navigate to `http://localhost:8000`.
2. Interact with the map to view risk levels and geographical data.
3. Use the buttons to download the map or share it on WhatsApp.

## File Structure
- `index.php`: Entry point for the application.
- `log_activity.php`: Handles logging of user activities.
- `assets/css/styles.css`: Contains styles for the application.
- `assets/json/mahalle_geojson.json`: GeoJSON data for neighborhoods.
- `assets/json/ilce_geojson.json`: GeoJSON data for districts.

## Dependencies
- Leaflet.js
- html2canvas
- OpenWeatherMap API

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Author
Developed by Alp Gursoy.
