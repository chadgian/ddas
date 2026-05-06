<?php
require_once __DIR__ . '/App.php';

// Start app (this automatically logs visit)
$app = new App();

// Optional: access DB anywhere
$pdo = $app->getDB();