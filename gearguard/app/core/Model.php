<?php
require_once __DIR__ . '/../config/db.php';

class Model {
    protected $db;

    public function __construct() {
        $this->db = Database::connect();
    }
}
