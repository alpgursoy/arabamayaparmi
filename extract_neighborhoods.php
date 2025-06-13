<?php

// Load GeoJSON files
$districtsFile = 'assets/json/ilce_geojson.json';
$neighborhoodsFile = 'assets/json/mahalle_geojson.json';

// Read and decode the files
$districtsData = json_decode(file_get_contents($districtsFile), true);
$neighborhoodsData = json_decode(file_get_contents($neighborhoodsFile), true);

// Initialize an array to store the results
$results = [];

// Extract district names
foreach ($districtsData['features'] as $district) {
    $districtName = $district['properties']['address']['archipelago'] ?? $district['properties']['address']['province'] ?? null;
    if ($districtName) {
        $results[$districtName] = [];
    }
}

// Extract neighborhoods and map them to districts
foreach ($neighborhoodsData['features'] as $neighborhood) {
    $neighborhoodName = $neighborhood['properties']['address']['city'] ?? $neighborhood['properties']['address']['neighborhood'] ?? null;
    $districtName = $neighborhood['properties']['address']['archipelago'] ?? $neighborhood['properties']['address']['province'] ?? null;

    if ($neighborhoodName && $districtName && isset($results[$districtName])) {
        $results[$districtName][] = $neighborhoodName;
    }
}

// Open a file for writing CSV with UTF-8 encoding
$outputFile = fopen('districts_neighborhoods.csv', 'w');

// Write the data rows in the specified format
foreach ($results as $district => $neighborhoods) {
    foreach ($neighborhoods as $neighborhood) {
        fwrite($outputFile, "$district, $neighborhood\n");
    }
}

// Close the file
fclose($outputFile);

echo "CSV file 'districts_neighborhoods.csv' has been created successfully in UTF-8 format.\n";

?>
