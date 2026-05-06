<?php
require_once 'core/init.php';

// Fetch logs
$stmt = $pdo->query("SELECT * FROM visit_logs ORDER BY visit_time DESC LIMIT 100");
$logs = $stmt->fetchAll();
?>

<!DOCTYPE html>
<html>
<head>
    <title>Visit Logs</title>
    <style>
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ccc; padding: 8px; }
    </style>
</head>
<body>

<h2>Visit Logs</h2>

<table>
    <tr>
        <th>ID</th>
        <th>IP</th>
        <th>Page</th>
        <th>User Agent</th>
        <th>Date</th>
    </tr>

    <?php foreach ($logs as $log): ?>
    <tr>
        <td><?= $log['id'] ?></td>
        <td><?= $log['ip_address'] ?></td>
        <td><?= $log['page'] ?></td>
        <td><?= $log['user_agent'] ?></td>
        <td><?= $log['visit_time'] ?></td>
    </tr>
    <?php endforeach; ?>
</table>

</body>
</html>