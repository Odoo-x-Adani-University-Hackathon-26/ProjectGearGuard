<?php
require_once __DIR__ . '/../core/Model.php';

class Equipment extends Model {

    public function getAll() {
        $stmt = $this->db->prepare("SELECT * FROM equipment");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function find($id) {
        $stmt = $this->db->prepare("SELECT * FROM equipment WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
