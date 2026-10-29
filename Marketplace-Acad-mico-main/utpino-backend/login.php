<?php
error_reporting(E_ALL & ~E_WARNING & ~E_NOTICE);
ini_set('display_errors', 0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

include 'conexion.php'; 

if (!isset($pdo) && isset($conn)) { $pdo = $conn; }
if (!isset($pdo) && isset($conexion)) { $pdo = $conexion; }

// Leer los datos JSON que envía Angular
$jsonContent = file_get_contents('php://input');
$data = json_decode($jsonContent, true);

// Extraer las credenciales soportando tanto JSON como $_POST por seguridad
$correo = $data['correo'] ?? $_POST['correo'] ?? '';
$password = $data['password'] ?? $_POST['password'] ?? ($_POST['contrasena'] ?? '');

if (empty($correo) || empty($password)) {
    echo json_encode(["success" => false, "message" => "Completa todos los campos"]);
    exit;
}

try {
    // Buscamos al usuario por correo
    $sql = "SELECT * FROM usuario WHERE correo = :correo";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':correo' => $correo]);
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

    // Validamos si el usuario existe y si la contraseña coincide
    if ($usuario && $usuario['contrasena'] === $password) {
        echo json_encode([
            "success" => true,
            "message" => "¡Bienvenido!",
            "nom_us"  => $usuario['nom_us'], // Enviamos el nombre real de la BD
            "foto"    => $usuario['foto']    // Enviamos la ruta de la foto de la BD
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Correo o contraseña incorrectos."
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Error en el servidor: " . $e->getMessage()
    ]);
}
?>