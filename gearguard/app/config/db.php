<?php

class Database {
    private static $conn = null;

    public static function connect() {
        if (self::$conn === null) {
            try {
                self::$conn = new PDO(
                    "mysql:host=localhost;dbname=gearguard;charset=utf8",
                    "root",
                    ""
                );
                self::$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            } catch (PDOException $e) {
                die("Database Connection Failed: " . $e->getMessage());
            }
        }
        return self::$conn;
    }
}
