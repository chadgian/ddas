<?php
declare(strict_types=1);

require_once __DIR__ . '/classes/userClass.php';

$username = trim((string) ($_REQUEST['u'] ?? $_REQUEST['username'] ?? ''));
$password = trim((string) ($_REQUEST['p'] ?? $_REQUEST['password'] ?? ''));

if ($username === '' || $password === '') {
    json_response([
        'status' => false,
        'message' => 'All fields are required',
    ], 422);
}

$user = new User();
json_response($user->validateLogin($username, $password));
