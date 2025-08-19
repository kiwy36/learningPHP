<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$servername = "localhost";
$username = "root";  // Usuario por defecto de XAMPP
$password = "";      // Contraseña por defecto de XAMPP
$dbname = "prueba_coneccion";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Consulta para obtener datos
$sql = "SELECT id, nombre, apellido, edad FROM personas";
$result = $conn->query($sql);

$personas = array();

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $personas[] = $row;
    }
} 

echo json_encode($personas);

$conn->close();
?>