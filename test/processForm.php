<?php
$fileInput = $_FILES['upload_file'] ?? null;

if ($fileInput) {
    $uploadDir = __DIR__ . '/uploads/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    $targetFile = $uploadDir . basename($fileInput['name']);
    if (move_uploaded_file($fileInput['tmp_name'], $targetFile)) {
        // echo "File uploaded successfully: " . htmlspecialchars($fileInput['name']);
        header("Location: sync.php");
    } else {
        echo "Error uploading file.";
    }
} else {
    echo "No file uploaded.";
}
?>

