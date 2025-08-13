function cargarProductos() {
    fetch('procesar.php', {
        method: 'POST',
        body: new URLSearchParams({accion: 'listar_productos'})
    })
    .then(res => res.json())
    .then(data => {
        let html = "<ul>";
        data.forEach(p => {
            html += `<li>${p.nombre} - Stock: ${p.stock}</li>`;
        });
        html += "</ul>";
        document.getElementById("lista-productos").innerHTML = html;
    });
}

document.getElementById("pedidoForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const datos = new FormData(this);
    const payload = {
        accion: "insertar_pedido",
        cliente_id: datos.get("cliente_id"),
        productos: [
            {
                id: datos.get("producto_id"),
                cantidad: datos.get("cantidad"),
                precio: datos.get("precio")
            }
        ]
    };

    fetch("procesar.php", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(r => alert(r.mensaje));
});
