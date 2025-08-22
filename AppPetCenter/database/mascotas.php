<?php
include 'conexion.php';

$action = $_GET['action'] ?? '';

if ($_SERVER['REQUEST_METHOD'] === 'GET' && $action === 'get') {
    // Obtener todas las mascotas con información del cliente
    $sql = "SELECT m.*, c.nombre as cliente_nombre 
            FROM mascotas m 
            LEFT JOIN clientes c ON m.cliente_id = c.id 
            ORDER BY m.nombre";
    $result = $conn->query($sql);
    
    if ($result->num_rows > 0) {
        $mascotas = [];
        while($row = $result->fetch_assoc()) {
            $mascotas[] = $row;
        }
        echo json_encode($mascotas);
    } else {
        echo json_encode(["error" => "No se encontraron mascotas"]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'create') {
    // Crear nueva mascota
    $data = json_decode(file_get_contents('php://input'), true);
    
    $nombre = $data['nombre'] ?? '';
    $especie = $data['especie'] ?? '';
    $raza = $data['raza'] ?? '';
    $edad = $data['edad'] ?? null;
    $cliente_id = $data['cliente_id'] ?? null;
    
    if (!empty($nombre) && !empty($cliente_id)) {
        $stmt = $conn->prepare("INSERT INTO mascotas (nombre, especie, raza, edad, cliente_id) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("sssii", $nombre, $especie, $raza, $edad, $cliente_id);
        
        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Mascota agregada correctamente"]);
        } else {
            echo json_encode(["success" => false, "error" => "Error al agregar mascota: " . $stmt->error]);
        }
        $stmt->close();
    } else {
        echo json_encode(["success" => false, "error" => "El nombre y el dueño son obligatorios"]);
    }
} else {
    echo json_encode(["error" => "Acción no válida"]);
}

$conn->close();
?>