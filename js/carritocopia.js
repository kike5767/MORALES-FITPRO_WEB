let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// ===== FORMATEAR PRECIO =====
function formatoPrecio(valor) {
    return valor.toLocaleString("es-CO");
}

// ===== GUARDAR CARRITO =====
function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// ===== MOSTRAR CARRITO =====
function mostrarCarrito() {

    const contenedor = document.getElementById("cart-items");
    const totalHTML = document.getElementById("cart-total");
    const acciones = document.getElementById("cart-actions");

    if (!contenedor) return;

    contenedor.innerHTML = "";

    let totalGeneral = 0;

    if (carrito.length === 0) {
        contenedor.innerHTML = "<p>El carrito está vacío.</p>";
        if (totalHTML) totalHTML.innerText = "$0";
        if (acciones) acciones.innerHTML = "";
        return;
    }

    carrito.forEach((producto, index) => {

        const subtotal = producto.precio * producto.cantidad;
        totalGeneral += subtotal;

        contenedor.innerHTML += `
        <div style="border-bottom:1px solid #ddd;padding:15px 0;">
            <h4>${producto.nombre}</h4>

            <p>
                Precio unidad: $${formatoPrecio(producto.precio)}
            </p>

            <p>
                Cantidad:
                <button onclick="cambiarCantidad(${index}, -1)">➖</button>
                <strong>${producto.cantidad}</strong>
                <button onclick="cambiarCantidad(${index}, 1)">➕</button>
            </p>

            <p>
                Subtotal: <strong>$${formatoPrecio(subtotal)}</strong>
            </p>

            <button onclick="eliminarProducto(${index})">
                Eliminar producto
            </button>
        </div>
        `;
    });

    if (totalHTML) {
        totalHTML.innerText = "$" + formatoPrecio(totalGeneral);
    }

    if (acciones) {
        acciones.innerHTML = `
            <button onclick="vaciarCarrito()">Vaciar carrito</button>
            <button onclick="enviarPedido()">Enviar pedido por WhatsApp</button>
        `;
    }
}

// ===== CAMBIAR CANTIDAD =====
function cambiarCantidad(index, cambio) {

    carrito[index].cantidad += cambio;

    if (carrito[index].cantidad <= 0) {
        carrito.splice(index, 1);
    }

    guardarCarrito();
    mostrarCarrito();
}

// ===== ELIMINAR PRODUCTO =====
function eliminarProducto(index) {
    carrito.splice(index, 1);
    guardarCarrito();
    mostrarCarrito();
}

// ===== VACIAR CARRITO =====
function vaciarCarrito() {
    carrito = [];
    guardarCarrito();
    mostrarCarrito();
}

// ===== ENVIAR PEDIDO =====
function enviarPedido() {

    if (carrito.length === 0) {
        alert("El carrito está vacío");
        return;
    }

    let pagoSeleccionado = document.querySelector('input[name="pago"]:checked');

    if (!pagoSeleccionado) {
        alert("Seleccione un medio de pago");
        return;
    }

    let mensaje = "Hola Luis Enrique, quiero hacer el siguiente pedido:%0A%0A";

    let totalGeneral = 0;

    carrito.forEach(producto => {

        const subtotal = producto.precio * producto.cantidad;
        totalGeneral += subtotal;

        mensaje += `• ${producto.nombre}%0A`;
        mensaje += `  Cantidad: ${producto.cantidad}%0A`;
        mensaje += `  Subtotal: $${formatoPrecio(subtotal)}%0A%0A`;
    });

    mensaje += `TOTAL: $${formatoPrecio(totalGeneral)}%0A`;
    mensaje += `Pago: ${pagoSeleccionado.value}`;

    window.open(`https://wa.me/573113526127?text=${mensaje}`, "_blank");
}

// ===== INICIAR =====
mostrarCarrito();
