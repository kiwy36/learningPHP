<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");

// Datos de conexión (los de XAMPP)
$servername = "localhost";
$username = "root";
$password = ""; // en XAMPP casi siempre está vacío
$dbname = "prueba";

// Conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Chequear conexión
if ($conn->connect_error) {
    echo json_encode(["error" => "Conexión fallida: " . $conn->connect_error]);
    exit;
}

// Consultar la tabla
$sql = "SELECT id, nombre FROM personas";
$result = $conn->query($sql);

// Guardar resultados
$personas = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $personas[] = $row;
    }
}

// Devolver JSON
echo json_encode($personas);

$conn->close();
?>
