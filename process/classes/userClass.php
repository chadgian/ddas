<?php
class User{
  private $conn;
  private $table = "users";

  public function __construct(){
    if (session_status() !== PHP_SESSION_ACTIVE) {
      session_start();
    }

    require_once __DIR__ . "/../db.php";
    $this->conn = $conn;
  }

  public function createUser($username, $password, $role){
    try {
      if  ($this->usernameExists($username)) {
        return [
          "status" => false,
          "message" => "Username already exists"
        ];
      }

      $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

      $sql = "INSERT INTO {$this->table} (username, password, role) VALUES (?, ?, ?)";
      $stmt = $this->conn->prepare($sql);
      $stmt->bind_param("sss", $username, $hashedPassword, $role);
      if($stmt->execute()){
        return [
          "status" => true,
          "message" => "User created successfully",
          "insert_id" => $stmt->insert_id
        ];
      }

      return [
        "status" => false,
        "message" => "Error creating user: " . $stmt->error
      ];
      
    } catch (Exception $e) {
      return [
        "status" => false,
        "message" => "Error creating user: " . $e->getMessage()
      ];

    }
  }

  public function validateLogin($username, $password){
    $sql = "SELECT id, password, role FROM {$this->table} WHERE username = ?";
    $stmt = $this->conn->prepare($sql);
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
      return [
        "status" => false,
        "message" => "Invalid username or password"
      ];
    }

    $user = $result->fetch_assoc();

    if ($user['status'] === 'inactive') {
      return [
        "status" => false,
        "message" => "User account is inactive"
      ];
    }

    if (password_verify($password, $user['password'])) {
      $this->saveLoginSession($user['id'], $user['role'], $username);
      return [
        "status" => true,
        "message" => "Login successful",
        "user_id" => $user['id'],
        "role" => $user['role']
      ];
    } else {
      return [
        "status" => false,
        "message" => "Invalid username or password"
      ];
    }
  }

  public function getUserById($id){
    $sql = "SELECT id, username, role FROM {$this->table} WHERE id = ?";
    $stmt = $this->conn->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
      return null;
    }

    return $result->fetch_assoc();
  }

  public function getUserByRole($role){
    $sql = "SELECT id, username FROM {$this->table} WHERE role = ?";
    $stmt = $this->conn->prepare($sql);
    $stmt->bind_param("s", $role);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
      return null;
    }

    return $result->fetch_assoc();
  }

  public function getAllUsers(){
    $sql = "SELECT id, username, role FROM {$this->table}";
    $result = $this->conn->query($sql);

    if ($result->num_rows === 0) {
      return null;
    }

    return $result->fetch_assoc();
  }

  public function updateUserByColumn($column, $data, $id){
    $allowedColumns = ['username', 'password', 'role'];

    if ($column === 'password' && empty($data)) {
      $data = "password123"; // Default password if new password is empty
    }

    if (!in_array($column, $allowedColumns)) {
      return [
        "status" => false,
        "message" => "Invalid column name"
      ];
    }

    if ($column === 'password') {
      $data = password_hash($data, PASSWORD_DEFAULT);
    }

    $sql = "UPDATE {$this->table} SET {$column} = ? WHERE id = ?";
    $stmt = $this->conn->prepare($sql);
    $stmt->bind_param("si", $data, $id);

    if ($stmt->execute()) {
      return [
        "status" => true,
        "message" => "User updated successfully"
      ];
    } else {
      return [
        "status" => false,
        "message" => "Error updating user: " . $stmt->error
      ];
    }
  }

  public function changePassword($newPassword, $oldPassword, $id){
    $user = $this->getUserById($id);
    if (!$user) {
      return [
        "status" => false,
        "message" => "User not found"
      ];
    }

    $sql = "SELECT password FROM {$this->table} WHERE id = ?";
    $stmt = $this->conn->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $currentPasswordHash = $result->fetch_assoc()['password'];
    if (!password_verify($oldPassword, $currentPasswordHash)) {
      return [
        "status" => false,
        "message" => "Old password is incorrect"
      ];
    }

    $updateResult = $this->updateUserByColumn('password', $newPassword, $id);
    if ($updateResult['status']) {
      return [
        "status" => true,
        "message" => "Password changed successfully"
      ];
    } else {
      return [
        "status" => false,
        "message" => "Error changing password: " . $updateResult['message']
      ];
    }
  }

  public function updateUserStatus($id){
    $sql = "UPDATE {$this->table} SET status = IF(status = 'active', 'inactive', 'active') WHERE id = ?";
    $stmt = $this->conn->prepare($sql);
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
      return [
        "status" => true,
        "message" => "User status updated successfully"
      ];
    } else {
      return [
        "status" => false,
        "message" => "Error updating user status: " . $stmt->error
      ];
    }
  }

  public function usernameExists($username, $excludedId = null){
    $sql = "SELECT userID FROM {$this->table} WHERE username = ?";
    if($excludedId !== null) {
      $sql .= "AND userID = ?";
    }
    $sql .= " LIMIT 1";

    $stmt = $this->conn->prepare($sql);

    if ($excludedId !== null){
      $stmt->bind_param("si", $username, $excludedId);
    } else {
      $stmt->bind_param("s", $username);
    }

    $stmt->execute();
    $result = $stmt->get_result();

    return $result->num_rows > 0;
  }

  public function saveLoginSession($userId, $role, $username){
    $_SESSION['user_id'] = $userId;
    $_SESSION['role'] = $role;
    $_SESSION['username'] = $username;
  }
}