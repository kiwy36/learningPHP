<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Permite llamadas desde cualquier origen
header('Access-Control-Allow-Methods: POST'); // Solo POST
header('Access-Control-Allow-Headers: Content-Type');

// CONFIGURAR CONEXIÓN
$servername = "localhost";
$username   = "root";
$password   = "";
$dbname     = "petcenter";

// Conectar a MySQL
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Error de conexión: " . $conn->connect_error]);
    exit;
}

// Leer datos enviados por POST (desde el fetch de JS)
$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['cliente_id']) || !isset($data['items'])) {
    echo json_encode(["status" => "error", "message" => "Datos incompletos"]);
    exit;
}

$cliente_id = intval($data['cliente_id']);
$items = $data['items'];

// Iniciar transacción
$conn->begin_transaction();

try {
    // Insertar pedido
    $fecha = date('Y-m-d');
    $sql_pedido = "INSERT INTO pedidos (cliente_id, fecha) VALUES (?, ?)";
    $stmt = $conn->prepare($sql_pedido);
    $stmt->bind_param("is", $cliente_id, $fecha);
    $stmt->execute();
    $pedido_id = $conn->insert_id;

    // Insertar cada item del pedido
    $sql_item = "INSERT INTO pedido_items (pedido_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)";
    $stmt_item = $conn->prepare($sql_item);

    foreach ($items as $item) {
        $producto_id = intval($item['producto_id']);
        $cantidad = intval($item['cantidad']);
        $precio = floatval($item['precio_unitario']);

        $stmt_item->bind_param("iiid", $pedido_id, $producto_id, $cantidad, $precio);
        $stmt_item->execute();

        // Actualizar stock
        $sql_update = "UPDATE productos SET stock = stock - ? WHERE id = ?";
        $stmt_update = $conn->prepare($sql_update);
        $stmt_update->bind_param("ii", $cantidad, $producto_id);
        $stmt_update->execute();
    }

    // Confirmar transacción
    $conn->commit();

    echo json_encode(["status" => "success", "message" => "Pedido registrado correctamente", "pedido_id" => $pedido_id]);

} catch (Exception $e) {
    // Si hay error, revertir
    $conn->rollback();
    echo json_encode(["status" => "error", "message" => "Error al procesar el pedido: " . $e->getMessage()]);
}

$conn->close();
?>
