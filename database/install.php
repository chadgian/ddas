<?php
declare(strict_types=1);

require_once __DIR__ . '/../core/config.php';

function connectServer(): PDO
{
    $dsn = 'mysql:host=' . DB_HOST . ';charset=utf8mb4';
    return new PDO($dsn, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
}

function tableExists(PDO $pdo, string $tableName): bool
{
    $stmt = $pdo->prepare(
        'SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = :db AND table_name = :table'
    );
    $stmt->execute(['db' => DB_NAME, 'table' => $tableName]);
    return (bool) $stmt->fetchColumn();
}

function legacyUsersNeedBackup(PDO $pdo): bool
{
    if (!tableExists($pdo, 'users')) {
      return false;
    }

    $stmt = $pdo->query('SHOW COLUMNS FROM users');
    $columns = array_map(static fn(array $row): string => $row['Field'], $stmt->fetchAll());
    return in_array('userID', $columns, true) || in_array('role', $columns, true);
}

function seedSetting(PDO $pdo, string $key, string $value): void
{
    $stmt = $pdo->prepare(
        'INSERT INTO settings (setting_key, setting_value) VALUES (:key, :value)
         ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)'
    );
    $stmt->execute(['key' => $key, 'value' => $value]);
}

function fetchUserId(PDO $pdo, string $username): ?int
{
    $stmt = $pdo->prepare('SELECT id FROM users WHERE username = :username LIMIT 1');
    $stmt->execute(['username' => $username]);
    $userId = $stmt->fetchColumn();
    return $userId === false ? null : (int) $userId;
}

function seedUser(
    PDO $pdo,
    string $username,
    string $plainPassword,
    string $fullName,
    string $email,
    string $accessGroup,
    ?string $department,
    ?string $agencyName,
    array $internalRoles = []
): void {
    $passwordHash = password_hash($plainPassword, PASSWORD_DEFAULT);

    $stmt = $pdo->prepare(
        'INSERT INTO users
          (username, password_hash, full_name, email, access_group, department, agency_name, status, must_change_password)
         VALUES
          (:username, :password_hash, :full_name, :email, :access_group, :department, :agency_name, :status, :must_change_password)
         ON DUPLICATE KEY UPDATE
          full_name = VALUES(full_name),
          email = VALUES(email),
          access_group = VALUES(access_group),
          department = VALUES(department),
          agency_name = VALUES(agency_name),
          status = VALUES(status)'
    );

    $stmt->execute([
        'username' => $username,
        'password_hash' => $passwordHash,
        'full_name' => $fullName,
        'email' => $email,
        'access_group' => $accessGroup,
        'department' => $department,
        'agency_name' => $agencyName,
        'status' => 'Active',
        'must_change_password' => 1,
    ]);

    $userId = fetchUserId($pdo, $username);
    if ($userId === null) {
        return;
    }

    $deleteStmt = $pdo->prepare('DELETE FROM user_internal_roles WHERE user_id = :user_id');
    $deleteStmt->execute(['user_id' => $userId]);

    if (!$internalRoles) {
        return;
    }

    $insertStmt = $pdo->prepare(
        'INSERT INTO user_internal_roles (user_id, role_name) VALUES (:user_id, :role_name)'
    );
    foreach ($internalRoles as $roleName) {
        $insertStmt->execute(['user_id' => $userId, 'role_name' => $roleName]);
    }
}

$pdo = connectServer();

$pdo->exec('CREATE DATABASE IF NOT EXISTS `' . DB_NAME . '` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
$pdo->exec('USE `' . DB_NAME . '`');

if (legacyUsersNeedBackup($pdo)) {
    $backupTable = 'users_legacy_backup_' . date('Ymd_His');
    $pdo->exec('RENAME TABLE users TO `' . $backupTable . '`');
}

$schema = file_get_contents(__DIR__ . '/schema.sql');
if ($schema === false) {
    throw new RuntimeException('Unable to read schema.sql');
}
$pdo->exec($schema);

seedSetting($pdo, 'storage_root', STORAGE_ROOT_DEFAULT);
seedSetting($pdo, 'internal_subdir', 'internal');
seedSetting($pdo, 'prime_subdir', 'prime_hrm');

seedUser(
    $pdo,
    'sys.admin',
    'ChangeMe123!',
    'System Administrator',
    'sys.admin@ddas.local',
    'PSED Admin',
    'PSED',
    null
);

seedUser(
    $pdo,
    'division.chief',
    'ChangeMe123!',
    'Division Chief',
    'division.chief@ddas.local',
    'Internal',
    'PSED',
    null,
    ['Division Chief', 'Management Committee']
);

seedUser(
    $pdo,
    'psed.staff',
    'ChangeMe123!',
    'PSED Staff',
    'psed.staff@ddas.local',
    'Internal',
    'PSED',
    null,
    ['Division Personnel', 'Divisions']
);

seedUser(
    $pdo,
    'cgo.bago',
    'ChangeMe123!',
    'CGO Bago Agency Account',
    'cgo.bago@agency.local',
    'Agency',
    'Agency',
    'CGO Bago'
);

echo "DDAS database installation completed.\n";
echo "Seed accounts:\n";
echo "  sys.admin / ChangeMe123!\n";
echo "  division.chief / ChangeMe123!\n";
echo "  psed.staff / ChangeMe123!\n";
echo "  cgo.bago / ChangeMe123!\n";
