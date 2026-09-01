<?php
declare(strict_types=1);

require_once __DIR__ . '/classes/userClass.php';

$user = new User();
$user->logout();
json_response(['status' => true, 'message' => 'Logged out successfully.']);
