/* ======================================================
   MORALES FITPRO - CARRITO DE COMPRAS (VERSION 1.0)
   Autor: Proyecto Morales FitPro Web
   Descripción:
   Carrito básico funcional usando LocalStorage.
   Diseñado para integrarse sin romper el sitio actual.
   ====================================================== */

// ==============================
// CONFIGURACION GENERAL
// ==============================

const CART_STORAGE_KEY = "morales_fitpro_cart";

// ==============================
// UTILIDADES
// ==============================

function getCart() {
    const cart = localStorage.getItem(CART_STORAGE_KEY);
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    updateCartCounter();
}

function formatPrice(value) {
    return "$" + value.toLocaleString("es-CO");
}

// ==============================
// AGREGAR PRODUCTO
// ==============================

function addToCart(product) {
    const cart = getCart();

    const existing = cart.find(p => p.id === product.id);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    saveCart(cart);
    console.log("Producto agregado:", product.name);
}

// ==============================
// ELIMINAR PRODUCTO
// ==============================

function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(p => p.id !== productId);
    saveCart(cart);
    renderCart();
}

// ==============================
// CAMBIAR CANTIDAD
// ==============================

function updateQuantity(productId, quantity) {
    const cart = getCart();
    const product = cart.find(p => p.id === productId);

    if (!product) return;

    product.quantity = Math.max(1, quantity);
    saveCart(cart);
    renderCart();
}

// ==============================
// TOTAL DEL CARRITO
// ==============================

function getCartTotal() {
    const cart = getCart();
    return cart.reduce((total, p) => total + (p.price * p.quantity), 0);
}

// ==============================
// CONTADOR EN HEADER
// ==============================

function updateCartCounter() {
    const counter = document.getElementById("cart-count");
    if (!counter) return;

    const cart = getCart();
    const totalItems = cart.reduce((sum, p) => sum + p.quantity, 0);
    counter.textContent = totalItems;
}

// ==============================
// RENDER DEL CARRITO
// ==============================

function renderCart() {
    const container = document.getElementById("cart-items");
    const totalElement = document.getElementById("cart-total");

    if (!container) return;

    const cart = getCart();
    container.innerHTML = "";

    if (cart.length === 0) {
        container.innerHTML = "<p>El carrito está vacío.</p>";
        if (totalElement) totalElement.textContent = "$0";
        return;
    }

    cart.forEach(product => {
        const item = document.createElement("div");
        item.className = "cart-item";

        item.innerHTML = `
            <div class="cart-item-info">
                <strong>${product.name}</strong>
                <span>${formatPrice(product.price)}</span>
            </div>

            <div class="cart-item-actions">
                <input type="number" min="1" value="${product.quantity}"
                    onchange="updateQuantity('${product.id}', this.value)">

                <button onclick="removeFromCart('${product.id}')">Eliminar</button>
            </div>
        `;

        container.appendChild(item);
    });

    if (totalElement) {
        totalElement.textContent = formatPrice(getCartTotal());
    }
}

// ==============================
// LIMPIAR CARRITO
// ==============================

function clearCart() {
    localStorage.removeItem(CART_STORAGE_KEY);
    renderCart();
    updateCartCounter();
}

// ==============================
// INICIALIZACION AUTOMATICA
// ==============================

document.addEventListener("DOMContentLoaded", () => {
    updateCartCounter();
    renderCart();
});


