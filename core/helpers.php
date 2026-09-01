<?php
declare(strict_types=1);

require_once __DIR__ . '/Database.php';

function db(): PDO
{
    static $pdo = null;
    if ($pdo === null) {
        $pdo = (new Database())->connect();
    }
    return $pdo;
}

function start_session_if_needed(): void
{
    if (session_status() !== PHP_SESSION_ACTIVE) {
        $sessionPath = rtrim(STORAGE_ROOT_DEFAULT, '\\/') . DIRECTORY_SEPARATOR . 'sessions';
        ensure_directory($sessionPath);
        if (session_save_path() !== $sessionPath) {
            session_save_path($sessionPath);
        }
        session_start();
    }
}

function json_response(array $payload, int $statusCode = 200): void
{
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload);
    exit;
}

function current_user_id(): ?int
{
    start_session_if_needed();
    return isset($_SESSION['user_id']) ? (int) $_SESSION['user_id'] : null;
}

function current_user(): ?array
{
    $userId = current_user_id();
    if ($userId === null) {
        return null;
    }

    $stmt = db()->prepare(
        'SELECT id, username, full_name, email, access_group, department, agency_name, status, must_change_password, last_login_at
         FROM users WHERE id = :id LIMIT 1'
    );
    $stmt->execute(['id' => $userId]);
    $user = $stmt->fetch();
    if (!$user) {
        return null;
    }

    $user['roles'] = fetch_internal_roles((int) $user['id']);
    return $user;
}

function require_login(): array
{
    $user = current_user();
    if ($user === null) {
        json_response(['status' => false, 'message' => 'Authentication required.'], 401);
    }
    return $user;
}

function require_access_groups(array $allowedGroups): array
{
    $user = require_login();
    if (!in_array($user['access_group'], $allowedGroups, true)) {
        json_response(['status' => false, 'message' => 'You do not have permission to perform this action.'], 403);
    }
    return $user;
}

function fetch_internal_roles(int $userId): array
{
    $stmt = db()->prepare(
        'SELECT role_name FROM user_internal_roles WHERE user_id = :user_id ORDER BY role_name'
    );
    $stmt->execute(['user_id' => $userId]);
    return array_map(static fn(array $row): string => $row['role_name'], $stmt->fetchAll());
}

function setting(string $key, ?string $default = null): ?string
{
    $stmt = db()->prepare('SELECT setting_value FROM settings WHERE setting_key = :key LIMIT 1');
    $stmt->execute(['key' => $key]);
    $value = $stmt->fetchColumn();
    return $value === false ? $default : (string) $value;
}

function set_setting(string $key, string $value): void
{
    $stmt = db()->prepare(
        'INSERT INTO settings (setting_key, setting_value) VALUES (:key, :value)
         ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)'
    );
    $stmt->execute(['key' => $key, 'value' => $value]);
}

function normalized_storage_root(): string
{
    $configured = setting('storage_root', STORAGE_ROOT_DEFAULT) ?? STORAGE_ROOT_DEFAULT;
    $path = str_replace(['/', '\\'], DIRECTORY_SEPARATOR, $configured);
    return rtrim($path, DIRECTORY_SEPARATOR);
}

function ensure_directory(string $path): void
{
    if (!is_dir($path) && !mkdir($path, 0775, true) && !is_dir($path)) {
        throw new RuntimeException('Unable to create directory: ' . $path);
    }
}

function slugify_segment(string $value): string
{
    $value = preg_replace('/[^A-Za-z0-9._ -]/', '', $value) ?? '';
    $value = trim($value);
    $value = preg_replace('/[ ]+/', '_', $value) ?? '';
    return $value !== '' ? $value : 'item';
}

function upload_subdir(string $type): string
{
    if ($type === 'prime') {
        return setting('prime_subdir', PRIME_UPLOAD_SUBDIR) ?? PRIME_UPLOAD_SUBDIR;
    }
    return setting('internal_subdir', INTERNAL_DOCUMENT_SUBDIR) ?? INTERNAL_DOCUMENT_SUBDIR;
}

function store_uploaded_file(array $file, string $subPath, string $storedFileName): array
{
    $root = normalized_storage_root();
    $fullDirectory = $root . DIRECTORY_SEPARATOR . trim($subPath, DIRECTORY_SEPARATOR);
    ensure_directory($fullDirectory);

    $destination = $fullDirectory . DIRECTORY_SEPARATOR . $storedFileName;
    if (!move_uploaded_file($file['tmp_name'], $destination)) {
        throw new RuntimeException('Failed to move uploaded file.');
    }

    $relativePath = trim($subPath, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $storedFileName;
    return [
        'full_path' => $destination,
        'relative_path' => str_replace('\\', '/', $relativePath),
    ];
}

function insert_activity_log(?int $userId, ?string $username, string $type, string $label, array $metadata = []): void
{
    $stmt = db()->prepare(
        'INSERT INTO activity_logs (user_id, username, action_type, action_label, metadata)
         VALUES (:user_id, :username, :action_type, :action_label, :metadata)'
    );
    $stmt->execute([
        'user_id' => $userId,
        'username' => $username,
        'action_type' => $type,
        'action_label' => $label,
        'metadata' => $metadata ? json_encode($metadata) : null,
    ]);
}

function safe_json_decode(?string $json, array $fallback = []): array
{
    if ($json === null || $json === '') {
        return $fallback;
    }
    $decoded = json_decode($json, true);
    return is_array($decoded) ? $decoded : $fallback;
}

function next_code(string $table, string $column, string $prefix): string
{
    $stmt = db()->prepare("SELECT {$column} FROM {$table} WHERE {$column} LIKE :prefix ORDER BY id DESC LIMIT 1");
    $stmt->execute(['prefix' => $prefix . '-%']);
    $last = $stmt->fetchColumn();
    if ($last === false || !preg_match('/(\d+)$/', (string) $last, $matches)) {
        return $prefix . '-001';
    }

    $next = str_pad((string) (((int) $matches[1]) + 1), 3, '0', STR_PAD_LEFT);
    return $prefix . '-' . $next;
}
