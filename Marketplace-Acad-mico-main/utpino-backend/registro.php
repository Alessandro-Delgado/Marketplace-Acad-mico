<?php
error_reporting(E_ALL & ~E_WARNING & ~E_NOTICE);
ini_set('display_errors', 0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

include 'conexion.php'; 

if (!isset($pdo) && isset($conn)) { $pdo = $conn; }
if (!isset($pdo) && isset($conexion)) { $pdo = $conexion; }

if (!$pdo) {
    echo json_encode([
        "success" => false, 
        "message" => "Error crítico: No se pudo conectar a la base de datos."
    ]);
    exit;
}

// Capturamos los datos asegurándonos de leer tanto 'password' como 'contrasena' por seguridad
$nombre = $_POST['nombre'] ?? '';
$correo = $_POST['correo'] ?? '';
$password = $_POST['password'] ?? ($_POST['contrasena'] ?? '');
$rutaFotoFinal = null;

// Validación estricta para evitar que pasen campos vacíos
if (empty($nombre) || empty($correo) || empty($password)) {
    echo json_encode([
        "success" => false, 
        "message" => "Error: Todos los campos obligatorios deben estar llenos."
    ]);
    exit;
}

// Procesar la foto de perfil de manera segura (opcional)
if (isset($_FILES['foto']) && $_FILES['foto']['error'] === UPLOAD_ERR_OK) {
    $fileTmpPath = $_FILES['foto']['tmp_name'];
    $fileName = $_FILES['foto']['name'];
    $newFileName = md5(time() . $fileName) . '.' . pathinfo($fileName, PATHINFO_EXTENSION);
    $uploadFileDir = './uploads/';
    
    if (!is_dir($uploadFileDir)) {
        mkdir($uploadFileDir, 0755, true);
    }
    
    $dest_path = $uploadFileDir . $newFileName;
    if (move_uploaded_file($fileTmpPath, $dest_path)) {
        $rutaFotoFinal = 'uploads/' . $newFileName; 
    }
}

try {
    $sql = "INSERT INTO usuario (nom_us, correo, contrasena, foto) VALUES (:nom_us, :correo, :contrasena, :foto)";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':nom_us'     => $nombre,
        ':correo'     => $correo,
        ':contrasena' => $password, // Se inserta la contraseña limpia directamente
        ':foto'       => $rutaFotoFinal
    ]);

    echo json_encode([
        "success" => true, 
        "message" => "¡Cuenta creada exitosamente!",
        "foto" => $rutaFotoFinal
    ]);

} catch (Exception $e) {
    echo json_encode([
        "success" => false, 
        "message" => "Error en la base de datos: " . $e->getMessage()
    ]);
}
?>