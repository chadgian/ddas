<?php
declare(strict_types=1);

require_once __DIR__ . '/classes/userClass.php';

$actor = require_access_groups(['PSED Admin']);
$userClass = new User();
$action = (string) ($_REQUEST['action'] ?? 'list');

if ($action === 'list') {
    json_response(['status' => true, 'users' => $userClass->getAllUsers()]);
}

if ($action === 'create') {
    $result = $userClass->createUser(
        trim((string) ($_POST['username'] ?? '')),
        trim((string) ($_POST['password'] ?? '')),
        trim((string) ($_POST['access_group'] ?? 'Internal')),
        trim((string) ($_POST['full_name'] ?? '')),
        trim((string) ($_POST['email'] ?? '')),
        trim((string) ($_POST['department'] ?? '')),
        trim((string) ($_POST['agency_name'] ?? '')),
        $_POST['roles'] ?? []
    );
    json_response($result, $result['status'] ? 200 : 422);
}

if ($action === 'update') {
    $id = (int) ($_POST['id'] ?? 0);
    $result = $userClass->updateUser($id, [
        'username' => $_POST['username'] ?? '',
        'full_name' => $_POST['full_name'] ?? '',
        'email' => $_POST['email'] ?? '',
        'access_group' => $_POST['access_group'] ?? 'Internal',
        'department' => $_POST['department'] ?? '',
        'agency_name' => $_POST['agency_name'] ?? '',
        'roles' => $_POST['roles'] ?? [],
        'status' => $_POST['status'] ?? 'Active',
        'password' => $_POST['password'] ?? '',
    ]);
    json_response($result, $result['status'] ? 200 : 422);
}

if ($action === 'toggle_status') {
    $id = (int) ($_POST['id'] ?? 0);
    json_response($userClass->updateUserStatus($id));
}

json_response(['status' => false, 'message' => 'Unsupported user action.'], 400);
