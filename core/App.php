<?php
require_once __DIR__ . '/Database.php';
require_once __DIR__ . '/Tracker.php';

class App {
    private $pdo;

    public function __construct() {
        $db = new Database();
        $this->pdo = $db->connect();

        $this->bootstrap();
    }

    private function bootstrap() {
        $this->initTracker();
    }

    private function initTracker() {
        $tracker = new Tracker($this->pdo);
        $tracker->logVisit();
    }

    public function getDB() {
        return $this->pdo;
    }
}
