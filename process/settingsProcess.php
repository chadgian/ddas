<?php
declare(strict_types=1);

require_once __DIR__ . '/classes/settingsClass.php';
require_once __DIR__ . '/classes/userClass.php';

$actor = require_login();
$settingsClass = new SettingsClass();
$action = (string) ($_REQUEST['action'] ?? 'get');

if ($action === 'get') {
    json_response(['status' => true, 'settings' => $settingsClass->getAll()]);
}

if ($action === 'save_storage') {
    if ($actor['access_group'] !== 'PSED Admin') {
        json_response(['status' => false, 'message' => 'Only PSED Admin can update storage settings.'], 403);
    }
    $result = $settingsClass->updateStorageSettings($_POST);
    json_response($result, $result['status'] ? 200 : 422);
}

if ($action === 'save_profile') {
    $userClass = new User();
    $result = $userClass->updateUser((int) $actor['id'], [
        'username' => $_POST['username'] ?? $actor['username'],
        'full_name' => $_POST['full_name'] ?? $actor['full_name'],
        'email' => $_POST['email'] ?? $actor['email'],
        'access_group' => $actor['access_group'],
        'department' => $actor['department'] ?? '',
        'agency_name' => $actor['agency_name'] ?? '',
        'status' => $actor['status'],
    ]);

    if (!empty($_POST['old_password']) && !empty($_POST['new_password'])) {
        $passwordResult = $userClass->changePassword(
            (string) $_POST['new_password'],
            (string) $_POST['old_password'],
            (int) $actor['id']
        );
        if (!$passwordResult['status']) {
            json_response($passwordResult, 422);
        }
    }

    json_response($result, $result['status'] ? 200 : 422);
}

json_response(['status' => false, 'message' => 'Unsupported settings action.'], 400);
