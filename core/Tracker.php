<?php
require_once __DIR__ . '/config.php';

class Tracker {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function logVisit() {

        // Avoid logging bots (basic filter)
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
        if (stripos($userAgent, 'bot') !== false) {
            return;
        }

        // Avoid duplicate logging in same session
        if (session_status() === PHP_SESSION_NONE) {
            $sessionPath = rtrim(STORAGE_ROOT_DEFAULT, '\\/') . DIRECTORY_SEPARATOR . 'sessions';
            if (!is_dir($sessionPath)) {
                @mkdir($sessionPath, 0775, true);
            }
            if (session_save_path() !== $sessionPath) {
                session_save_path($sessionPath);
            }
            if (!@session_start()) {
                error_log('Visit tracking session start failed.');
            }
        }

        if (session_status() === PHP_SESSION_ACTIVE) {
            if (isset($_SESSION['visited'])) {
                return;
            }

            $_SESSION['visited'] = true;
        }

        // Get visitor data
        $ip = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '';
        $page = $_SERVER['REQUEST_URI'] ?? '';

        // Insert log
        try {
            $stmt = $this->pdo->prepare("
                INSERT INTO visit_logs (ip_address, user_agent, page)
                VALUES (:ip, :user_agent, :page)
            ");

            $stmt->execute([
                ':ip' => $ip,
                ':user_agent' => $userAgent,
                ':page' => $page
            ]);
        } catch (Throwable $e) {
            error_log('Visit tracking failed: ' . $e->getMessage());
        }
    }
}
