<?php

include __DIR__ . "/classes/userClass.php";

if ($_SERVER["REQUEST_METHOD"] === "GET") {
  $username = $_GET["u"] ?? "";
  $password = $_GET["p"] ?? "";
  // $role = $_GET["r"] ?? "";

  if (empty($username) || empty($password)) {
    echo json_encode([
      "status" => false,
      "message" => "All fields are required"
    ]);
    exit;
  }

  $user = new User();
  $result = $user->validateLogin($username, $password);

  echo json_encode($result);
}