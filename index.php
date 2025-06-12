<?php
// Entry point for the application

?><!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kuş Riski Uygulaması</title>
    <link rel="stylesheet" href="assets/css/styles.css">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.min.js"></script>
</head>
<body>
    <div id="map" style="height: 100vh;"></div>
    <script>
        // Initialize the map
        const map = L.map('map').setView([41.0082, 28.9784], 10); // Istanbul coordinates

        // Add Mapbox tiles
        const mapboxToken = 'pk.eyJ1IjoiZ3Vyc295IiwiYSI6ImNtN3lpYXBodDA4aW0ybHNqbW9vdmdkZmgifQ.KeXn87pVlcM1az2nxeGhcA';
        L.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${mapboxToken}`, {
            maxZoom: 19,
            tileSize: 512,
            zoomOffset: -1,
        }).addTo(map);

        // Load GeoJSON for neighborhoods with zoom level control
        const neighborhoodLayer = L.geoJSON(null, {
            style: {
                color: '#3388ff',
                weight: 2,
            },
        }).addTo(map);

        fetch('assets/json/mahalle_geojson.json')
            .then(response => response.json())
            .then(data => {
                neighborhoodLayer.addData(data);
            });

        map.on('zoomend', () => {
            if (map.getZoom() >= 12) {
                map.addLayer(neighborhoodLayer);
            } else {
                map.removeLayer(neighborhoodLayer);
            }
        });

        // Load GeoJSON for districts
        fetch('assets/json/ilce_geojson.json')
            .then(response => response.json())
            .then(data => {
                L.geoJSON(data, {
                    style: {
                        color: '#ff8800',
                        weight: 2,
                    },
                }).addTo(map);
            });

        // Fetch weather data from OpenWeatherMap API
        const apiKey = 'ca47884892f86e0d206b6689e9cb4b7c';
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=Istanbul&units=metric&appid=${apiKey}`;

        fetch(weatherUrl)
            .then(response => response.json())
            .then(data => {
                const temperature = data.main.temp;
                const windSpeed = data.wind.speed;
                console.log(`Temperature: ${temperature}°C, Wind Speed: ${windSpeed} m/s`);

                // Display weather data on the map
                const weatherInfo = `Temperature: ${temperature}°C, Wind Speed: ${windSpeed} m/s`;
                L.control({ position: 'topright' }).onAdd = function () {
                    const div = L.DomUtil.create('div', 'weather-info');
                    div.innerHTML = weatherInfo;
                    return div;
                }.addTo(map);

                // Risk calculation logic
                function calculateRisk(birdPopulation, temperature, windSpeed) {
                    // Normalize scores (example weights)
                    const normalizedBirdPopulation = birdPopulation / 100;
                    const normalizedTemperature = temperature / 40; // Assuming max temp is 40°C
                    const normalizedWindSpeed = windSpeed / 20; // Assuming max wind speed is 20 m/s

                    // Calculate weighted risk score
                    const riskScore = (normalizedBirdPopulation + normalizedTemperature + normalizedWindSpeed) / 3;

                    // Define thresholds for risk levels
                    if (riskScore < 0.3) {
                        return 'No Risk';
                    } else if (riskScore < 0.6) {
                        return 'Low Risk';
                    } else if (riskScore < 0.8) {
                        return 'Medium Risk';
                    } else {
                        return 'High Risk';
                    }
                }

                // Request user's location
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        position => {
                            const location = {
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude
                            };

                            // Use location in risk calculation and activity logging
                            fetch('assets/json/bird_population.json')
                                .then(response => response.json())
                                .then(birdData => {
                                    const birdPopulation = birdData.population; // Example key
                                    const temperature = 25; // Replace with actual fetched temperature
                                    const windSpeed = 10; // Replace with actual fetched wind speed

                                    const riskLevel = calculateRisk(birdPopulation, temperature, windSpeed);
                                    console.log(`Risk Level: ${riskLevel}`);

                                    // Display risk level on the map
                                    const riskInfo = `Risk Level: ${riskLevel}`;
                                    const riskControl = L.control({ position: 'bottomright' });
                                    riskControl.onAdd = function () {
                                        const div = L.DomUtil.create('div', 'risk-info');
                                        div.innerHTML = riskInfo;
                                        return div;
                                    };
                                    riskControl.addTo(map);

                                    // Log activity to the database
                                    function logActivity(location, temperature, windSpeed, riskLevel) {
                                        fetch('log_activity.php', {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify({
                                                location: location,
                                                temperature: temperature,
                                                windSpeed: windSpeed,
                                                riskLevel: riskLevel,
                                            }),
                                        })
                                        .then(response => response.json())
                                        .then(data => {
                                            console.log('Activity logged:', data);
                                        })
                                        .catch(error => console.error('Error logging activity:', error));
                                    }

                                    // Example usage
                                    logActivity(location, temperature, windSpeed, riskLevel);
                                })
                                .catch(error => console.error('Error fetching bird population data:', error));
                        },
                        error => console.error('Error getting location:', error)
                    );
                } else {
                    console.error('Geolocation is not supported by this browser.');
                }
            })
            .catch(error => console.error('Error fetching weather data:', error));

        // Add buttons for social media sharing and downloading
        const shareContainer = L.control({ position: 'bottomleft' });
        shareContainer.onAdd = function () {
            const div = L.DomUtil.create('div', 'share-buttons');
            div.innerHTML = `
                <button id="download-btn">Download Map</button>
                <button id="whatsapp-btn">Share on WhatsApp</button>
            `;
            return div;
        };
        shareContainer.addTo(map);

        // Download map as an image
        document.getElementById('download-btn').addEventListener('click', () => {
            html2canvas(document.getElementById('map')).then(canvas => {
                const link = document.createElement('a');
                link.download = 'map.png';
                link.href = canvas.toDataURL();
                link.click();
            });
        });

        // Share map on WhatsApp
        document.getElementById('whatsapp-btn').addEventListener('click', () => {
            html2canvas(document.getElementById('map')).then(canvas => {
                const imageData = canvas.toDataURL();
                const blob = dataURLtoBlob(imageData);
                const file = new File([blob], 'map.png', { type: 'image/png' });

                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    navigator.share({
                        files: [file],
                        title: 'Risk Map',
                        text: 'Check out the bird risk map!',
                    }).catch(error => console.error('Error sharing:', error));
                } else {
                    alert('Sharing not supported on this device.');
                }
            });
        });

        // Helper function to convert data URL to Blob
        function dataURLtoBlob(dataURL) {
            const parts = dataURL.split(',');
            const byteString = atob(parts[1]);
            const mimeString = parts[0].split(':')[1].split(';')[0];
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            return new Blob([ab], { type: mimeString });
        }
    </script>
</body>
</html>
