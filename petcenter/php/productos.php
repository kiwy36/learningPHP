<?php
include 'conexion.php';

$action = $_GET['action'] ?? '';

if ($_SERVER['REQUEST_METHOD'] === 'GET' && $action === 'get') {
    // Obtener todos los productos con información de categoría
    $sql = "SELECT p.*, c.nombre as categoria_nombre 
            FROM productos p 
            LEFT JOIN categorias_productos c ON p.categoria_id = c.id 
            ORDER BY p.nombre";
    $result = $conn->query($sql);
    
    if ($result->num_rows > 0) {
        $productos = [];
        while($row = $result->fetch_assoc()) {
            $productos[] = $row;
        }
        echo json_encode($productos);
    } else {
        echo json_encode(["error" => "No se encontraron productos"]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'create') {
    // Crear nuevo producto
    $data = json_decode(file_get_contents('php://input'), true);
    
    $nombre = $data['nombre'] ?? '';
    $descripcion = $data['descripcion'] ?? '';
    $precio = $data['precio'] ?? 0;
    $stock = $data['stock'] ?? 0;
    $categoria_id = $data['categoria_id'] ?? null;
    
    if (!empty($nombre) && $precio >= 0 && $stock >= 0) {
        $stmt = $conn->prepare("INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("ssdii", $nombre, $descripcion, $precio, $stock, $categoria_id);
        
        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Producto agregado correctamente"]);
        } else {
            echo json_encode(["success" => false, "error" => "Error al agregar producto: " . $stmt->error]);
        }
        $stmt->close();
    } else {
        echo json_encode(["success" => false, "error" => "Datos inválidos"]);
    }
} else {
    echo json_encode(["error" => "Acción no válida"]);
}

$conn->close();
?>