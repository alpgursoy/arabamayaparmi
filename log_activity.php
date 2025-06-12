<?php
// Log activity to the database

$host = 'localhost';
$db = 'kusboku';
$user = 'root';
$pass = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);

if ($data) {
    $location = $data['location'] ?? '';
    $temperature = $data['temperature'] ?? 0;
    $windSpeed = $data['windSpeed'] ?? 0;
    $riskLevel = $data['riskLevel'] ?? '';

    // Insert into database
    $query = "INSERT INTO activity_logs (location, temperature, wind_speed, risk_level) VALUES (:location, :temperature, :windSpeed, :riskLevel)";
    $stmt = $pdo->prepare($query);
    $stmt->execute([
        ':location' => $location,
        ':temperature' => $temperature,
        ':windSpeed' => $windSpeed,
        ':riskLevel' => $riskLevel,
    ]);

    echo json_encode(['status' => 'success']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid data']);
}
?>
