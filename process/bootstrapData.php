<?php
declare(strict_types=1);

require_once __DIR__ . '/../core/helpers.php';
require_once __DIR__ . '/classes/documentClass.php';
require_once __DIR__ . '/classes/primeSubmissionClass.php';
require_once __DIR__ . '/classes/userClass.php';
require_once __DIR__ . '/classes/settingsClass.php';

start_session_if_needed();
$user = current_user();

if ($user === null) {
    json_response([
        'status' => true,
        'authenticated' => false,
        'user' => null,
        'documents' => [],
        'users' => [],
        'prime_submissions' => [],
        'logs' => [],
        'settings' => [],
        'internal_roles' => INTERNAL_ROLES,
    ]);
}

$documents = $user['access_group'] === 'Agency' ? [] : (new DocumentClass())->all();
$primeSubmissions = (new PrimeSubmissionClass())->all(
    $user['access_group'] === 'Agency' ? (int) $user['id'] : null
);
$users = $user['access_group'] === 'PSED Admin' ? (new User())->getAllUsers() : [];

$logs = [];
if ($user['access_group'] !== 'Agency') {
    $logsStmt = db()->prepare(
        'SELECT id, user_id, username, action_type, action_label, metadata, created_at
         FROM activity_logs
         ORDER BY created_at DESC
         LIMIT 100'
    );
    $logsStmt->execute();
    $logs = $logsStmt->fetchAll();
}

$settings = $user['access_group'] === 'PSED Admin' ? (new SettingsClass())->getAll() : [];

$mappedDocuments = array_map(static function (array $row): array {
    return [
        'dbId' => (int) $row['id'],
        'id' => $row['document_code'],
        'title' => $row['title'],
        'src' => $row['source_office'],
        'docType' => $row['document_type'],
        'date' => substr((string) $row['uploaded_at'], 0, 10),
        'status' => $row['status'],
        'size' => number_format(((int) $row['file_size_bytes']) / 1024, 1) . ' KB',
        'pages' => 1,
        'audience' => $row['is_all_personnel'] ? ['All Personnel'] : ($row['visibility_roles'] ?: ['All Personnel']),
        'retention' => $row['retention_period'] ?: '',
        'notes' => $row['description'] ?: '',
        'details' => $row['extra_metadata'] ?? [],
        'originalFilename' => $row['original_filename'],
        'storedFilename' => $row['stored_filename'],
        'relativePath' => $row['relative_path'],
    ];
}, $documents);

$usernamesById = [];
foreach ($users as $row) {
    $usernamesById[(int) $row['id']] = $row['username'];
}

$mappedPrime = array_map(static function (array $row) use ($usernamesById): array {
    $folderPath = dirname(str_replace('\\', '/', (string) $row['relative_path']));
    return [
        'dbId' => (int) $row['id'],
        'id' => $row['submission_code'],
        'agency' => $row['agency_name'],
        'account' => $usernamesById[(int) $row['agency_user_id']] ?? '',
        'originalFileName' => $row['original_filename'],
        'savedFileName' => $row['stored_filename'],
        'folderPath' => str_replace('/', ' / ', $folderPath),
        'coreArea' => $row['core_area'],
        'pillar' => $row['pillar'],
        'element' => $row['pillar_element'],
        'indicator' => $row['indicator_label'],
        'indicatorCode' => $row['indicator_code'],
        'submitted' => substr((string) $row['submitted_at'], 0, 10),
        'status' => $row['status'],
        'size' => number_format(((int) $row['file_size_bytes']) / 1024, 1) . ' KB',
        'relativePath' => $row['relative_path'],
    ];
}, $primeSubmissions);

$mappedUsers = array_map(static function (array $row): array {
    return [
        'id' => (int) $row['id'],
        'name' => $row['full_name'],
        'user' => $row['username'],
        'dept' => $row['department'] ?: '',
        'agency' => $row['agency_name'] ?: '',
        'access' => $row['access_group'],
        'roles' => $row['roles'],
        'email' => $row['email'] ?: '',
        'status' => $row['status'],
    ];
}, $users);

$mappedLogs = array_map(static function (array $row): array {
    return [
        'id' => (int) $row['id'],
        'act' => $row['action_label'],
        'usr' => $row['username'] ?: 'system',
        'type' => $row['action_type'],
        'time' => str_replace('T', ' ', substr((string) $row['created_at'], 0, 16)),
        'metadata' => safe_json_decode($row['metadata'] ?? null),
    ];
}, $logs);

json_response([
    'status' => true,
    'authenticated' => true,
    'user' => [
        'id' => (int) $user['id'],
        'name' => $user['full_name'],
        'user' => $user['username'],
        'dept' => $user['department'] ?: '',
        'agency' => $user['agency_name'] ?: '',
        'access' => $user['access_group'],
        'roles' => $user['roles'],
        'email' => $user['email'] ?: '',
        'status' => $user['status'],
    ],
    'documents' => $mappedDocuments,
    'users' => $mappedUsers,
    'prime_submissions' => $mappedPrime,
    'logs' => $mappedLogs,
    'settings' => $settings,
    'internal_roles' => INTERNAL_ROLES,
]);
