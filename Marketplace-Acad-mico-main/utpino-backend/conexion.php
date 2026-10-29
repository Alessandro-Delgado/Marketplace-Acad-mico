<?php
$host = "localhost";
$usuario = "root"; 
$password = ""; 
$base_de_datos = "utpino_comparte";
try {
    // Definimos la variable $conn que espera tu login.php
    $conn = new PDO("mysql:host=$host;dbname=$base_de_datos;charset=utf8", $usuario, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Error de conexión: " . $e->getMessage()]);
    exit();
}
?>