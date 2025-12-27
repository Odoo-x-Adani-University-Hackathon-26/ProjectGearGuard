<?php
require_once __DIR__ . '/../models/Equipment.php';

class EquipmentController {

    public function index() {
        $equipmentModel = new Equipment();
        $equipments = $equipmentModel->getAll();

        require '../app/views/equipment/index.php';
    }
}
