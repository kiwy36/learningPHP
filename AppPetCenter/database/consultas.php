<?php
include 'conexion.php';

$action = $_GET['action'] ?? '';

if ($_SERVER['REQUEST_METHOD'] === 'GET' && $action === 'get') {
    // Obtener todas las consultas con información de mascota y veterinario
    $sql = "SELECT cv.*, m.nombre as mascota_nombre, v.nombre as veterinario_nombre 
            FROM consultas_veterinarias cv 
            LEFT JOIN mascotas m ON cv.mascota_id = m.id 
            LEFT JOIN veterinarios v ON cv.veterinario_id = v.id 
            ORDER BY cv.fecha DESC";
    $result = $conn->query($sql);
    
    if ($result->num_rows > 0) {
        $consultas = [];
        while($row = $result->fetch_assoc()) {
            $consultas[] = $row;
        }
        echo json_encode($consultas);
    } else {
        echo json_encode(["error" => "No se encontraron consultas"]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'create') {
    // Crear nueva consulta
    $data = json_decode(file_get_contents('php://input'), true);
    
    $mascota_id = $data['mascota_id'] ?? '';
    $veterinario_id = $data['veterinario_id'] ?? '';
    $fecha = $data['fecha'] ?? '';
    $diagnostico = $data['diagnostico'] ?? '';
    $tratamiento = $data['tratamiento'] ?? '';
    $costo = $data['costo'] ?? 0;
    
    if (!empty($mascota_id) && !empty($veterinario_id) && !empty($fecha)) {
        $stmt = $conn->prepare("INSERT INTO consultas_veterinarias (mascota_id, veterinario_id, fecha, diagnostico, tratamiento, costo) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("iisssd", $mascota_id, $veterinario_id, $fecha, $diagnostico, $tratamiento, $costo);
        
        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Consulta registrada correctamente"]);
        } else {
            echo json_encode(["success" => false, "error" => "Error al registrar consulta: " . $stmt->error]);
        }
        $stmt->close();
    } else {
        echo json_encode(["success" => false, "error" => "Datos incompletos"]);
    }
} else {
    echo json_encode(["error" => "Acción no válida"]);
}

$conn->close();
?>