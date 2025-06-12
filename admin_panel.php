<?php
// Admin Panel for Activity Logs

// Database connection
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

// Fetch activity logs
$query = "SELECT * FROM activity_logs ORDER BY timestamp DESC";
$stmt = $pdo->prepare($query);
$stmt->execute();
$logs = $stmt->fetchAll(PDO::FETCH_ASSOC);

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Panel - Activity Logs</title>
    <link rel="stylesheet" href="assets/css/styles.css">
</head>
<body>
    <h1>Activity Logs</h1>
    <table border="1">
        <thead>
            <tr>
                <th>Timestamp</th>
                <th>Location</th>
                <th>Temperature</th>
                <th>Wind Speed</th>
                <th>Risk Level</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($logs as $log): ?>
                <tr>
                    <td><?= htmlspecialchars($log['timestamp']) ?></td>
                    <td><?= htmlspecialchars($log['location']) ?></td>
                    <td><?= htmlspecialchars($log['temperature']) ?>°C</td>
                    <td><?= htmlspecialchars($log['wind_speed']) ?> m/s</td>
                    <td><?= htmlspecialchars($log['risk_level']) ?></td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</body>
</html>
