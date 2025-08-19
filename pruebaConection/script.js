document.addEventListener('DOMContentLoaded', function() {
    const btnConectar = document.getElementById('btnConectar');
    const btnLeerDatos = document.getElementById('btnLeerDatos');
    const statusDiv = document.getElementById('status');
    const tablaBody = document.querySelector('#tablaPersonas tbody');
    
    // URL del endpoint PHP (ajusta si es necesario)
    const API_URL = 'http://localhost/conexion.php';
    
    // Función para probar la conexión
    btnConectar.addEventListener('click', testConnection);
    
    // Función para leer y mostrar datos
    btnLeerDatos.addEventListener('click', fetchData);
    
    function testConnection() {
        updateStatus("Probando conexión...", '');
        
        fetch(API_URL)
            .then(handleResponse)
            .then(data => {
                updateStatus(`¡Conexión exitosa! La tabla tiene ${data.length} registros.`, 'success');
                console.log("Conexión exitosa. Datos recibidos:", data);
            })
            .catch(error => {
                updateStatus("Error de conexión: " + error.message, 'error');
                console.error("Error de conexión:", error);
            });
    }
    
    function fetchData() {
        updateStatus("Leyendo datos...", '');
        
        fetch(API_URL)
            .then(handleResponse)
            .then(data => {
                renderTable(data);
                updateStatus(`Datos cargados correctamente. Total: ${data.length} registros.`, 'success');
                console.log("Datos recibidos:", data);
            })
            .catch(error => {
                updateStatus("Error al leer datos: " + error.message, 'error');
                console.error("Error al leer datos:", error);
            });
    }
    
    function handleResponse(response) {
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor: ' + response.status);
        }
        return response.json();
    }
    
    function updateStatus(message, type) {
        statusDiv.textContent = message;
        statusDiv.className = type ? `status ${type}` : 'status';
    }
    
    function renderTable(data) {
        // Limpiar tabla
        tablaBody.innerHTML = '';
        
        // Llenar tabla con nuevos datos
        data.forEach(persona => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${persona.id}</td>
                <td>${persona.nombre}</td>
                <td>${persona.apellido}</td>
                <td>${persona.edad}</td>
            `;
            tablaBody.appendChild(row);
        });
    }
});