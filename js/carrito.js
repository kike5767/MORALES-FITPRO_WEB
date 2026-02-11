/* ======================================
   MORALES FITPRO - CARRITO FINAL
   ====================================== */

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

/* =========================
   FORMATO PRECIO
========================= */
function formatoPrecio(valor) {
    return valor.toLocaleString("es-CO");
}

/* =========================
   GUARDAR CARRITO
========================= */
function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarContador();
}

/* =========================
   MENSAJE FLOTANTE
========================= */
function mostrarMensaje(texto) {
    let toast = document.getElementById("cart-toast");

    if (!toast) {
        toast = document.createElement("div");
        toast.id = "cart-toast";
        toast.className = "cart-toast";
        document.body.appendChild(toast);
    }

    toast.innerText = texto;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
}

/* =========================
   AGREGAR PRODUCTO
========================= */
function addToCart({id, name, price}) {
    let productoExistente = carrito.find(p => p.id === id);

    if (productoExistente) {
        productoExistente.cantidad += 1;
    } else {
        carrito.push({
            id: id,
            nombre: name,
            precio: price,
            cantidad: 1
        });
    }

    guardarCarrito();
    mostrarMensaje(name + " agregado al carrito");
}

/* =========================
   MOSTRAR CARRITO
========================= */
function mostrarCarrito() {
    const contenedor = document.getElementById("cart-items");
    const resumenHTML = document.getElementById("cart-summary");
    const acciones = document.getElementById("cart-actions");
    const formularioCliente = document.getElementById("client-form");
    const seccionPago = document.getElementById("payment-section");

    if (!contenedor) return;

    contenedor.innerHTML = "";
    let totalGeneral = 0;
    let subtotalGeneral = 0;

    if (carrito.length === 0) {
        contenedor.innerHTML = "<p style='text-align:center;padding:40px;color:#666;'>El carrito está vacío.</p>";
        if (resumenHTML) resumenHTML.innerHTML = "";
        if (acciones) acciones.innerHTML = "";
        if (formularioCliente) formularioCliente.style.display = "none";
        if (seccionPago) seccionPago.style.display = "none";
        return;
    }

    // Mostrar productos
    carrito.forEach((producto, index) => {
        const subtotal = producto.precio * producto.cantidad;
        totalGeneral += subtotal;
        subtotalGeneral += subtotal;

        contenedor.innerHTML += `
        <div style="border:1px solid #ddd;border-radius:8px;padding:15px;margin-bottom:15px;background:#f9f9f9;">
            <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:10px;">
                <div style="flex:1;">
                    <h4 style="margin:0 0 10px 0;color:#333;">${producto.nombre}</h4>
                    <p style="margin:5px 0;color:#666;">Precio unidad: <strong>$${formatoPrecio(producto.precio)}</strong></p>
                    <p style="margin:5px 0;">
                        Cantidad: 
                        <button onclick="cambiarCantidad(${index}, -1)" style="padding:5px 10px;margin:0 5px;background:#007ACC;color:white;border:none;border-radius:3px;cursor:pointer;">➖</button>
                        <strong style="padding:0 10px;">${producto.cantidad}</strong>
                        <button onclick="cambiarCantidad(${index}, 1)" style="padding:5px 10px;margin:0 5px;background:#007ACC;color:white;border:none;border-radius:3px;cursor:pointer;">➕</button>
                    </p>
                    <p style="margin:10px 0 0 0;font-size:18px;color:#007ACC;">
                        <strong>Subtotal: $${formatoPrecio(subtotal)}</strong>
                    </p>
                </div>
                <button onclick="eliminarProducto(${index})" style="padding:8px 15px;background:#dc3545;color:white;border:none;border-radius:5px;cursor:pointer;font-size:14px;">Eliminar</button>
            </div>
        </div>
        `;
    });

    // Mostrar resumen de totales
    if (resumenHTML) {
        resumenHTML.innerHTML = `
            <div style="background:#e3f2fd;padding:20px;border-radius:8px;">
                <div style="display:flex;justify-content:space-between;margin-bottom:10px;font-size:16px;">
                    <span>Subtotal:</span>
                    <strong>$${formatoPrecio(subtotalGeneral)}</strong>
                </div>
                <div style="display:flex;justify-content:space-between;margin-bottom:10px;font-size:16px;">
                    <span>Envío:</span>
                    <span style="color:#666;">A coordinar</span>
                </div>
                <hr style="margin:15px 0;border-color:#007ACC;">
                <div style="display:flex;justify-content:space-between;font-size:24px;font-weight:bold;color:#007ACC;">
                    <span>TOTAL:</span>
                    <span>$${formatoPrecio(totalGeneral)}</span>
                </div>
            </div>
        `;
    }

    // Mostrar formulario y sección de pago
    if (formularioCliente) formularioCliente.style.display = "block";
    if (seccionPago) seccionPago.style.display = "block";

    // Mostrar botones de acción
    if (acciones) {
        acciones.innerHTML = `
            <button onclick="vaciarCarrito()" style="padding:12px 25px;margin:0 10px;background:#6c757d;color:white;border:none;border-radius:5px;cursor:pointer;font-size:16px;">Vaciar carrito</button>
            <button onclick="procesarCompra()" style="padding:12px 30px;margin:0 10px;background:#25D366;color:white;border:none;border-radius:5px;cursor:pointer;font-size:16px;font-weight:bold;">Completar Compra</button>
        `;
    }
}

/* =========================
   CANTIDAD
========================= */
function cambiarCantidad(index, cambio) {
    carrito[index].cantidad += cambio;
    if (carrito[index].cantidad <= 0) {
        carrito.splice(index, 1);
    }
    guardarCarrito();
    mostrarCarrito();
}

function eliminarProducto(index) {
    carrito.splice(index, 1);
    guardarCarrito();
    mostrarCarrito();
}

function vaciarCarrito() {
    carrito = [];
    guardarCarrito();
    mostrarCarrito();
}

/* =========================
   CONTADOR HEADER
========================= */
function actualizarContador() {
    const contador = document.getElementById("cart-count");
    if (!contador) return;

    const total = carrito.reduce((acc, p) => acc + p.cantidad, 0);
    contador.innerText = total;
}

/* =========================
   PROCESAR COMPRA
========================= */
function procesarCompra() {
    if (carrito.length === 0) {
        alert("El carrito está vacío");
        return;
    }

    // Validar datos del cliente
    const nombre = document.getElementById("cliente-nombre").value.trim();
    const telefono = document.getElementById("cliente-telefono").value.trim();
    const ciudad = document.getElementById("cliente-ciudad").value.trim();
    const direccion = document.getElementById("cliente-direccion").value.trim();

    if (!nombre || !telefono || !ciudad || !direccion) {
        alert("Por favor complete todos los campos obligatorios (*)");
        return;
    }

    let pagoSeleccionado = document.querySelector('input[name="pago"]:checked');
    if (!pagoSeleccionado) {
        alert("Seleccione un medio de pago");
        return;
    }

    const barrio = document.getElementById("cliente-barrio").value.trim();
    const email = document.getElementById("cliente-email").value.trim();

    // Construir mensaje para WhatsApp
    let mensaje = "Hola Luis Enrique, quiero hacer el siguiente pedido:%0A%0A";
    let totalGeneral = 0;

    mensaje += "📦 PRODUCTOS:%0A";
    carrito.forEach(producto => {
        const subtotal = producto.precio * producto.cantidad;
        totalGeneral += subtotal;
        mensaje += `• ${producto.nombre}%0A  Cantidad: ${producto.cantidad}%0A  Precio unitario: $${formatoPrecio(producto.precio)}%0A  Subtotal: $${formatoPrecio(subtotal)}%0A%0A`;
    });

    mensaje += "━━━━━━━━━━━━━━━━━━━━%0A";
    mensaje += `💰 TOTAL: $${formatoPrecio(totalGeneral)}%0A`;
    mensaje += `💳 Pago: ${pagoSeleccionado.value}%0A%0A`;

    mensaje += "👤 DATOS DEL CLIENTE:%0A";
    mensaje += `Nombre: ${nombre}%0A`;
    mensaje += `Teléfono: ${telefono}%0A`;
    mensaje += `Ciudad: ${ciudad}%0A`;
    if (barrio) mensaje += `Barrio: ${barrio}%0A`;
    mensaje += `Dirección: ${direccion}%0A`;
    if (email) mensaje += `Email: ${email}%0A`;

    // Guardar datos localmente (para control interno)
    const pedido = {
        fecha: new Date().toISOString(),
        productos: carrito,
        total: totalGeneral,
        cliente: {
            nombre: nombre,
            telefono: telefono,
            ciudad: ciudad,
            barrio: barrio,
            direccion: direccion,
            email: email
        },
        pago: pagoSeleccionado.value
    };

    // Guardar en localStorage (solo para referencia local)
    let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
    pedidos.push(pedido);
    localStorage.setItem("pedidos", JSON.stringify(pedidos));

    // Abrir WhatsApp
    window.open(`https://wa.me/573113526127?text=${mensaje}`, "_blank");

    // Limpiar carrito después de enviar
    setTimeout(() => {
        carrito = [];
        guardarCarrito();
        mostrarCarrito();
        document.getElementById("cliente-nombre").value = "";
        document.getElementById("cliente-telefono").value = "";
        document.getElementById("cliente-ciudad").value = "";
        document.getElementById("cliente-barrio").value = "";
        document.getElementById("cliente-direccion").value = "";
        document.getElementById("cliente-email").value = "";
        document.querySelectorAll('input[name="pago"]').forEach(radio => radio.checked = false);
        alert("¡Pedido enviado! Revisa WhatsApp para confirmar.");
    }, 1000);
}

/* =========================
   ENVIAR WHATSAPP (compatibilidad)
========================= */
function enviarPedido() {
    procesarCompra();
}

/* =========================
   INICIO
========================= */
document.addEventListener("DOMContentLoaded", function () {
    mostrarCarrito();
    actualizarContador();
});
