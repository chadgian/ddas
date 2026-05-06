<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Create Account</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      background-color: #f5f5f5;
    }
    .container {
      background-color: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
    }
    h2 {
      text-align: center;
      color: #333;
    }
    .form-group {
      margin-bottom: 15px;
    }
    label {
      display: block;
      margin-bottom: 5px;
      color: #555;
      font-weight: bold;
    }
    input, select {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      box-sizing: border-box;
      font-size: 14px;
    }
    input:focus, select:focus {
      outline: none;
      border-color: #4CAF50;
      box-shadow: 0 0 5px rgba(76, 175, 80, 0.3);
    }
    button {
      width: 100%;
      padding: 10px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      cursor: pointer;
      font-weight: bold;
    }
    button:hover {
      background-color: #45a049;
    }
    .message {
      margin-top: 15px;
      padding: 10px;
      border-radius: 4px;
      text-align: center;
    }
    .success {
      background-color: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }
    .error {
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Create Account</h2>
    <form method="POST" action="">
      <div class="form-group">
        <label for="username">Username:</label>
        <input type="text" id="username" name="username" required>
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" required>
      </div>
      <div class="form-group">
        <label for="role">Role:</label>
        <select id="role" name="role" required>
          <option value="">-- Select Role --</option>
          <option value="admin">Admin</option>
          <option value="staff">Staff</option>
        </select>
      </div>
      <button type="submit" name="create_user">Create Account</button>
    </form>

    <?php
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['create_user'])) {
      $username = trim($_POST['username'] ?? '');
      $password = trim($_POST['password'] ?? '');
      $role = trim($_POST['role'] ?? '');

      if (empty($username) || empty($password) || empty($role)) {
        echo '<div class="message error">All fields are required.</div>';
      } else if (strlen($password) < 6) {
        echo '<div class="message error">Password must be at least 6 characters long.</div>';
      } else {
        
        include __DIR__ . "/../process/classes/userClass.php";
        $user = new User();
        $result = $user->createUser($username, $password, $role);

        if (!$result['status']) {
          echo '<div class="message error">' . htmlspecialchars($result['message']) . '</div>';
        } else {
          echo '<div class="message success">Account created successfully for ' . htmlspecialchars($username) . '!</div>';
        }
        
      }
    }
    ?>
  </div>
</body>
</html>