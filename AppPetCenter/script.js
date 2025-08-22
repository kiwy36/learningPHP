document.addEventListener('DOMContentLoaded', function() {
    // Navegación entre secciones
    const navButtons = document.querySelectorAll('.nav-btn');
    const contentSections = document.querySelectorAll('.content-section');
    
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-section');
            
            // Actualizar botones activos
            navButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Mostrar sección correspondiente
            contentSections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetSection) {
                    section.classList.add('active');
                    // Cargar datos cuando se muestra la sección
                    loadSectionData(targetSection);
                }
            });
        });
    });
    
    // Cargar datos iniciales
    loadClientes();
    loadMascotasOptions();
    
    // Manejar formularios
    document.getElementById('clienteForm').addEventListener('submit', handleClienteSubmit);
    document.getElementById('mascotaForm').addEventListener('submit', handleMascotaSubmit);
    document.getElementById('productoForm').addEventListener('submit', handleProductoSubmit);
    document.getElementById('consultaForm').addEventListener('submit', handleConsultaSubmit);
});

function loadSectionData(section) {
    switch(section) {
        case 'clientes':
            loadClientes();
            break;
        case 'mascotas':
            loadMascotas();
            break;
        case 'productos':
            loadProductos();
            break;
        case 'consultas':
            loadConsultas();
            break;
    }
}

// Funciones para cargar datos
function loadClientes() {
    fetch('php/clientes.php?action=get')
        .then(response => response.json())
        .then(data => {
            const clientesList = document.getElementById('clientesList');
            if (data.error) {
                clientesList.innerHTML = `<div class="error">${data.error}</div>`;
            } else {
                let html = `
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Email</th>
                                <th>Teléfono</th>
                                <th>Fecha Registro</th>
                            </tr>
                        </thead>
                        <tbody>
                `;
                
                data.forEach(cliente => {
                    html += `
                        <tr>
                            <td>${cliente.id}</td>
                            <td>${cliente.nombre}</td>
                            <td>${cliente.email || '-'}</td>
                            <td>${cliente.telefono || '-'}</td>
                            <td>${cliente.fecha_registro}</td>
                        </tr>
                    `;
                });
                
                html += `</tbody></table>`;
                clientesList.innerHTML = html;
            }
        })
        .catch(error => {
            document.getElementById('clientesList').innerHTML = `<div class="error">Error al cargar clientes: ${error}</div>`;
        });
}

function loadMascotas() {
    fetch('php/mascotas.php?action=get')
        .then(response => response.json())
        .then(data => {
            const mascotasList = document.getElementById('mascotasList');
            if (data.error) {
                mascotasList.innerHTML = `<div class="error">${data.error}</div>`;
            } else {
                let html = `
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Especie</th>
                                <th>Raza</th>
                                <th>Edad</th>
                                <th>Dueño</th>
                            </tr>
                        </thead>
                        <tbody>
                `;
                
                data.forEach(mascota => {
                    html += `
                        <tr>
                            <td>${mascota.id}</td>
                            <td>${mascota.nombre}</td>
                            <td>${mascota.especie || '-'}</td>
                            <td>${mascota.raza || '-'}</td>
                            <td>${mascota.edad || '-'}</td>
                            <td>${mascota.cliente_nombre}</td>
                        </tr>
                    `;
                });
                
                html += `</tbody></table>`;
                mascotasList.innerHTML = html;
            }
        })
        .catch(error => {
            document.getElementById('mascotasList').innerHTML = `<div class="error">Error al cargar mascotas: ${error}</div>`;
        });
}

function loadMascotasOptions() {
    fetch('php/mascotas.php?action=get')
        .then(response => response.json())
        .then(data => {
            if (!data.error) {
                const select = document.getElementById('consultaMascota');
                select.innerHTML = '<option value="">Seleccionar mascota</option>';
                
                data.forEach(mascota => {
                    const option = document.createElement('option');
                    option.value = mascota.id;
                    option.textContent = `${mascota.nombre} (${mascota.cliente_nombre})`;
                    select.appendChild(option);
                });
            }
        });
}

function loadProductos() {
    fetch('php/productos.php?action=get')
        .then(response => response.json())
        .then(data => {
            const productosList = document.getElementById('productosList');
            if (data.error) {
                productosList.innerHTML = `<div class="error">${data.error}</div>`;
            } else {
                let html = `
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Precio</th>
                                <th>Stock</th>
                                <th>Categoría</th>
                            </tr>
                        </thead>
                        <tbody>
                `;
                
                data.forEach(producto => {
                    html += `
                        <tr>
                            <td>${producto.id}</td>
                            <td>${producto.nombre}</td>
                            <td>${producto.descripcion || '-'}</td>
                            <td>$${producto.precio}</td>
                            <td>${producto.stock}</td>
                            <td>${producto.categoria_nombre || '-'}</td>
                        </tr>
                    `;
                });
                
                html += `</tbody></table>`;
                productosList.innerHTML = html;
            }
        })
        .catch(error => {
            document.getElementById('productosList').innerHTML = `<div class="error">Error al cargar productos: ${error}</div>`;
        });
}

function loadConsultas() {
    fetch('php/consultas.php?action=get')
        .then(response => response.json())
        .then(data => {
            const consultasList = document.getElementById('consultasList');
            if (data.error) {
                consultasList.innerHTML = `<div class="error">${data.error}</div>`;
            } else {
                let html = `
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Fecha</th>
                                <th>Mascota</th>
                                <th>Veterinario</th>
                                <th>Diagnóstico</th>
                                <th>Costo</th>
                            </tr>
                        </thead>
                        <tbody>
                `;
                
                data.forEach(consulta => {
                    html += `
                        <tr>
                            <td>${consulta.id}</td>
                            <td>${consulta.fecha}</td>
                            <td>${consulta.mascota_nombre}</td>
                            <td>${consulta.veterinario_nombre}</td>
                            <td>${consulta.diagnostico || '-'}</td>
                            <td>$${consulta.costo || '0.00'}</td>
                        </tr>
                    `;
                });
                
                html += `</tbody></table>`;
                consultasList.innerHTML = html;
            }
        })
        .catch(error => {
            document.getElementById('consultasList').innerHTML = `<div class="error">Error al cargar consultas: ${error}</div>`;
        });
}

// Funciones para manejar envío de formularios
function handleClienteSubmit(e) {
    e.preventDefault();
    
    const formData = {
        nombre: document.getElementById('clienteNombre').value,
        email: document.getElementById('clienteEmail').value,
        telefono: document.getElementById('clienteTelefono').value
    };
    
    fetch('php/clientes.php?action=create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showMessage('Cliente agregado correctamente', 'success');
            document.getElementById('clienteForm').reset();
            loadClientes();
        } else {
            showMessage(`Error: ${data.error}`, 'error');
        }
    })
    .catch(error => {
        showMessage(`Error: ${error}`, 'error');
    });
}

function handleMascotaSubmit(e) {
    e.preventDefault();
    
    const formData = {
        nombre: document.getElementById('mascotaNombre').value,
        especie: document.getElementById('mascotaEspecie').value,
        raza: document.getElementById('mascotaRaza').value,
        edad: document.getElementById('mascotaEdad').value,
        cliente_id: document.getElementById('mascotaCliente').value
    };
    
    fetch('php/mascotas.php?action=create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showMessage('Mascota agregada correctamente', 'success');
            document.getElementById('mascotaForm').reset();
            loadMascotas();
        } else {
            showMessage(`Error: ${data.error}`, 'error');
        }
    })
    .catch(error => {
        showMessage(`Error: ${error}`, 'error');
    });
}

function handleProductoSubmit(e) {
    e.preventDefault();
    
    const formData = {
        nombre: document.getElementById('productoNombre').value,
        descripcion: document.getElementById('productoDescripcion').value,
        precio: document.getElementById('productoPrecio').value,
        stock: document.getElementById('productoStock').value,
        categoria_id: document.getElementById('productoCategoria').value
    };
    
    fetch('php/productos.php?action=create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showMessage('Producto agregado correctamente', 'success');
            document.getElementById('productoForm').reset();
            loadProductos();
        } else {
            showMessage(`Error: ${data.error}`, 'error');
        }
    })
    .catch(error => {
        showMessage(`Error: ${error}`, 'error');
    });
}

function handleConsultaSubmit(e) {
    e.preventDefault();
    
    const formData = {
        mascota_id: document.getElementById('consultaMascota').value,
        veterinario_id: document.getElementById('consultaVeterinario').value,
        fecha: document.getElementById('consultaFecha').value,
        diagnostico: document.getElementById('consultaDiagnostico').value,
        tratamiento: document.getElementById('consultaTratamiento').value,
        costo: document.getElementById('consultaCosto').value
    };
    
    fetch('php/consultas.php?action=create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showMessage('Consulta registrada correctamente', 'success');
            document.getElementById('consultaForm').reset();
            loadConsultas();
        } else {
            showMessage(`Error: ${data.error}`, 'error');
        }
    })
    .catch(error => {
        showMessage(`Error: ${error}`, 'error');
    });
}

function showMessage(message, type) {
    // Crear elemento de mensaje
    const messageDiv = document.createElement('div');
    messageDiv.className = type;
    messageDiv.textContent = message;
    
    // Insertar al principio del main
    const main = document.querySelector('main');
    main.insertBefore(messageDiv, main.firstChild);
    
    // Eliminar después de 5 segundos
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}