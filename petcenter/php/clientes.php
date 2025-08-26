<?php
include 'conexion.php';

$action = $_GET['action'] ?? '';

if ($_SERVER['REQUEST_METHOD'] === 'GET' && $action === 'get') {
    // Obtener todos los clientes
    $sql = "SELECT * FROM clientes ORDER BY nombre";
    $result = $conn->query($sql);
    
    if ($result->num_rows > 0) {
        $clientes = [];
        while($row = $result->fetch_assoc()) {
            $clientes[] = $row;
        }
        echo json_encode($clientes);
    } else {
        echo json_encode(["error" => "No se encontraron clientes"]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'create') {
    // Crear nuevo cliente
    $data = json_decode(file_get_contents('php://input'), true);
    
    $nombre = $data['nombre'] ?? '';
    $email = $data['email'] ?? '';
    $telefono = $data['telefono'] ?? '';
    
    if (!empty($nombre)) {
        $stmt = $conn->prepare("INSERT INTO clientes (nombre, email, telefono) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $nombre, $email, $telefono);
        
        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Cliente agregado correctamente"]);
        } else {
            echo json_encode(["success" => false, "error" => "Error al agregar cliente: " . $stmt->error]);
        }
        $stmt->close();
    } else {
        echo json_encode(["success" => false, "error" => "El nombre es obligatorio"]);
    }
} else {
    echo json_encode(["error" => "Acción no válida"]);
}

$conn->close();
?>