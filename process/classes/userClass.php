<?php
declare(strict_types=1);

require_once __DIR__ . '/../../core/helpers.php';

class User
{
    private PDO $pdo;

    public function __construct()
    {
        start_session_if_needed();
        $this->pdo = db();
    }

    public function createUser(
        string $username,
        string $password,
        string $accessGroup,
        string $fullName = '',
        string $email = '',
        string $department = '',
        string $agencyName = '',
        array $internalRoles = []
    ): array {
        if ($this->usernameExists($username)) {
            return ['status' => false, 'message' => 'Username already exists'];
        }

        $fullName = trim($fullName) !== '' ? trim($fullName) : $username;
        $department = trim($department) !== '' ? trim($department) : ($accessGroup === 'Agency' ? 'Agency' : 'PSED');
        $agencyName = $accessGroup === 'Agency' ? (trim($agencyName) !== '' ? trim($agencyName) : $fullName) : null;

        $stmt = $this->pdo->prepare(
            'INSERT INTO users
              (username, password_hash, full_name, email, access_group, department, agency_name, status, must_change_password)
             VALUES
              (:username, :password_hash, :full_name, :email, :access_group, :department, :agency_name, :status, :must_change_password)'
        );

        $stmt->execute([
            'username' => $username,
            'password_hash' => password_hash($password, PASSWORD_DEFAULT),
            'full_name' => $fullName,
            'email' => trim($email) !== '' ? trim($email) : null,
            'access_group' => $accessGroup,
            'department' => $department,
            'agency_name' => $agencyName,
            'status' => 'Active',
            'must_change_password' => 1,
        ]);

        $userId = (int) $this->pdo->lastInsertId();
        $this->syncInternalRoles($userId, $accessGroup === 'Internal' ? $internalRoles : []);

        return [
            'status' => true,
            'message' => 'User created successfully',
            'insert_id' => $userId,
        ];
    }

    public function validateLogin(string $username, string $password): array
    {
        $stmt = $this->pdo->prepare(
            'SELECT id, username, password_hash, full_name, access_group, agency_name, status
             FROM users WHERE username = :username LIMIT 1'
        );
        $stmt->execute(['username' => $username]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($password, $user['password_hash'])) {
            return ['status' => false, 'message' => 'Invalid username or password'];
        }

        if ($user['status'] !== 'Active') {
            return ['status' => false, 'message' => 'User account is inactive'];
        }

        $this->saveLoginSession((int) $user['id']);

        $updateStmt = $this->pdo->prepare(
            'UPDATE users SET last_login_at = NOW() WHERE id = :id'
        );
        $updateStmt->execute(['id' => $user['id']]);

        insert_activity_log((int) $user['id'], $user['username'], 'Login', 'User signed in');

        return [
            'status' => true,
            'message' => 'Login successful',
            'user_id' => (int) $user['id'],
            'role' => $user['access_group'],
            'user' => [
                'id' => (int) $user['id'],
                'username' => $user['username'],
                'full_name' => $user['full_name'],
                'access_group' => $user['access_group'],
                'agency_name' => $user['agency_name'],
                'roles' => fetch_internal_roles((int) $user['id']),
            ],
        ];
    }

    public function getUserById(int $id): ?array
    {
        $stmt = $this->pdo->prepare(
            'SELECT id, username, full_name, email, access_group, department, agency_name, status, must_change_password, last_login_at
             FROM users WHERE id = :id LIMIT 1'
        );
        $stmt->execute(['id' => $id]);
        $user = $stmt->fetch();
        if (!$user) {
            return null;
        }
        $user['roles'] = fetch_internal_roles($id);
        return $user;
    }

    public function getAllUsers(): array
    {
        $rows = $this->pdo->query(
            'SELECT id, username, full_name, email, access_group, department, agency_name, status, must_change_password, last_login_at
             FROM users ORDER BY access_group, full_name'
        )->fetchAll();

        foreach ($rows as &$row) {
            $row['roles'] = fetch_internal_roles((int) $row['id']);
        }

        return $rows;
    }

    public function updateUser(int $id, array $data): array
    {
        $existing = $this->getUserById($id);
        if ($existing === null) {
            return ['status' => false, 'message' => 'User not found'];
        }

        $username = trim((string) ($data['username'] ?? $existing['username']));
        if ($username !== $existing['username'] && $this->usernameExists($username, $id)) {
            return ['status' => false, 'message' => 'Username already exists'];
        }

        $accessGroup = (string) ($data['access_group'] ?? $existing['access_group']);
        $agencyName = $accessGroup === 'Agency'
            ? trim((string) ($data['agency_name'] ?? $existing['agency_name'] ?? $existing['full_name']))
            : null;

        $stmt = $this->pdo->prepare(
            'UPDATE users
             SET username = :username,
                 full_name = :full_name,
                 email = :email,
                 access_group = :access_group,
                 department = :department,
                 agency_name = :agency_name,
                 status = :status
             WHERE id = :id'
        );

        $stmt->execute([
            'id' => $id,
            'username' => $username,
            'full_name' => trim((string) ($data['full_name'] ?? $existing['full_name'])),
            'email' => trim((string) ($data['email'] ?? $existing['email'] ?? '')) ?: null,
            'access_group' => $accessGroup,
            'department' => trim((string) ($data['department'] ?? $existing['department'] ?? '')) ?: null,
            'agency_name' => $agencyName,
            'status' => (string) ($data['status'] ?? $existing['status']),
        ]);

        if (!empty($data['password'])) {
            $passwordStmt = $this->pdo->prepare(
                'UPDATE users SET password_hash = :password_hash, must_change_password = 1 WHERE id = :id'
            );
            $passwordStmt->execute([
                'id' => $id,
                'password_hash' => password_hash((string) $data['password'], PASSWORD_DEFAULT),
            ]);
        }

        $this->syncInternalRoles($id, $accessGroup === 'Internal' ? (array) ($data['roles'] ?? []) : []);

        return ['status' => true, 'message' => 'User updated successfully'];
    }

    public function changePassword(string $newPassword, string $oldPassword, int $id): array
    {
        $stmt = $this->pdo->prepare('SELECT password_hash FROM users WHERE id = :id LIMIT 1');
        $stmt->execute(['id' => $id]);
        $hash = $stmt->fetchColumn();
        if ($hash === false || !password_verify($oldPassword, (string) $hash)) {
            return ['status' => false, 'message' => 'Old password is incorrect'];
        }

        $updateStmt = $this->pdo->prepare(
            'UPDATE users SET password_hash = :password_hash, must_change_password = 0 WHERE id = :id'
        );
        $updateStmt->execute([
            'id' => $id,
            'password_hash' => password_hash($newPassword, PASSWORD_DEFAULT),
        ]);

        return ['status' => true, 'message' => 'Password changed successfully'];
    }

    public function updateUserStatus(int $id): array
    {
        $stmt = $this->pdo->prepare(
            "UPDATE users SET status = CASE WHEN status = 'Active' THEN 'Suspended' ELSE 'Active' END WHERE id = :id"
        );
        $stmt->execute(['id' => $id]);

        return ['status' => true, 'message' => 'User status updated successfully'];
    }

    public function usernameExists(string $username, ?int $excludedId = null): bool
    {
        $sql = 'SELECT id FROM users WHERE username = :username';
        $params = ['username' => $username];
        if ($excludedId !== null) {
            $sql .= ' AND id <> :excluded_id';
            $params['excluded_id'] = $excludedId;
        }
        $sql .= ' LIMIT 1';

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return (bool) $stmt->fetchColumn();
    }

    public function saveLoginSession(int $userId): void
    {
        $_SESSION['user_id'] = $userId;
    }

    public function logout(): void
    {
        insert_activity_log(current_user_id(), current_user()['username'] ?? null, 'Logout', 'User signed out');
        $_SESSION = [];
        if (ini_get('session.use_cookies')) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], $params['secure'], $params['httponly']);
        }
        session_destroy();
    }

    private function syncInternalRoles(int $userId, array $roles): void
    {
        $roles = array_values(array_unique(array_filter(array_map('trim', $roles))));

        $deleteStmt = $this->pdo->prepare('DELETE FROM user_internal_roles WHERE user_id = :user_id');
        $deleteStmt->execute(['user_id' => $userId]);

        if (!$roles) {
            return;
        }

        $insertStmt = $this->pdo->prepare(
            'INSERT INTO user_internal_roles (user_id, role_name) VALUES (:user_id, :role_name)'
        );
        foreach ($roles as $roleName) {
            $insertStmt->execute(['user_id' => $userId, 'role_name' => $roleName]);
        }
    }
}
