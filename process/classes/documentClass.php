<?php

class documentClass {
  private $conn;
  private $table = "documents";

  public function __construct() {
    if (session_status() !== PHP_SESSION_ACTIVE) {
      session_start();
    }

    require_once __DIR__ . "/../db.php";
    $this->conn = $conn;
  }

  public function createDocument($title, $content, $author_id) {
    try {
      $sql = "INSERT INTO {$this->table} (title, content, author_id) VALUES (?, ?, ?)";
      $stmt = $this->conn->prepare($sql);
      $stmt->bind_param("ssi", $title, $content, $author_id);
      if ($stmt->execute()) {
        return [
          "status" => true,
          "message" => "Document created successfully",
          "insert_id" => $stmt->insert_id
        ];
      }

      return [
        "status" => false,
        "message" => "Error creating document: " . $stmt->error
      ];

    } catch (Exception $e) {
      return [
        "status" => false,
        "message" => "Error creating document: " . $e->getMessage()
      ];
    }
  }
}