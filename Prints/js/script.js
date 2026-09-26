/* =========================================================
   PRINTS - SCRIPT PRINCIPAL
   ========================================================= */

const galerias = {
    playeras: [
        "playera01.png",
        "playera02.png",
        "playera03.png",
        "playera04.png",
        "playera05.png",
        "playera06.png",
        "playera07.png",
        "playera08.png",
        "playera09.png",
        "playera10.png"
    ],
    sudaderas: [
        "sudadera01.png",
        "sudadera02.png",
        "sudadera03.png",
        "sudadera04.png",
        "sudadera05.png",
        "sudadera06.png",
        "sudadera07.png",
        "sudadera08.png",
        "sudadera09.png",
        "sudadera10.png"
    ],
    pantalones: [
        "pantalon01.png",
        "pantalon02.png",
        "pantalon03.png",
        "pantalon04.png",
        "pantalon05.png",
        "pantalon06.png",
        "pantalon07.png",
        "pantalon08.png",
        "pantalon09.png",
        "pantalon10.png"
    ]
};

const nombresGaleria = {
    playeras: "Playeras",
    sudaderas: "Sudaderas",
    pantalones: "Pantalones"
};

let carrito = [];

function abrirGaleria(tipo) {
    const modal = document.getElementById("galleryModal");
    const grid = document.getElementById("galleryGrid");
    const titulo = document.getElementById("galleryTitle");

    if (!modal || !grid || !titulo) return;

    titulo.textContent = nombresGaleria[tipo];
    grid.innerHTML = "";

    galerias[tipo].forEach((imagen, index) => {
        const numero = index + 1;
        const tarjeta = document.createElement("div");
        tarjeta.className = "gallery-item";

        tarjeta.innerHTML = `
            <div class="gallery-image">
                <img
                    src="imagenes/diseños/${imagen}"
                    alt="${nombresGaleria[tipo]} diseño ${numero}"
                >
            </div>

            <div class="gallery-item-info">
                <span>
                    DISEÑO ${String(numero).padStart(2, "0")}
                </span>
                <strong>
                    COTIZACIÓN
                </strong>
            </div>

            <button
                type="button"
                class="gallery-add"
                onclick="seleccionarDiseño('${tipo}', ${numero}, '${imagen}')"
            >
                AGREGAR AL CARRITO
            </button>
        `;

        grid.appendChild(tarjeta);
    });

    modal.classList.add("active");
    document.body.classList.add("modal-open");
}

function cerrarGaleria() {
    const modal = document.getElementById("galleryModal");
    if (!modal) return;

    modal.classList.remove("active");
    document.body.classList.remove("modal-open");
}

function seleccionarDiseño(categoria, numero, imagen) {
    const id = `${categoria}-${numero}`;

    const productoExistente = carrito.find(
        producto => producto.id === id
    );

    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push({
            id: id,
            categoria: nombresGaleria[categoria],
            numero: numero,
            imagen: imagen,
            cantidad: 1
        });
    }

    guardarCarrito();
    actualizarCarrito();
    cerrarGaleria();
    abrirCarrito();
}

function actualizarCarrito() {
    const cartCount = document.getElementById("cartCount");
    const cartItems = document.getElementById("cartItems");

    const cantidadTotal = carrito.reduce(
        (total, producto) => total + producto.cantidad,
        0
    );

    if (cartCount) {
        cartCount.textContent = cantidadTotal;
    }

    if (!cartItems) return;

    if (carrito.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">
                    🛍
                </div>
                <h3>
                    Tu carrito está vacío
                </h3>
                <p>
                    Agrega algún diseño de la colección
                    para solicitar una cotización.
                </p>
            </div>
        `;
        return;
    }

    cartItems.innerHTML = "";

    carrito.forEach(producto => {
        const item = document.createElement("div");
        item.className = "cart-item";

        item.innerHTML = `
            <div class="cart-item-image">
                <img
                    src="imagenes/diseños/${producto.imagen}"
                    alt="${producto.categoria}"
                >
            </div>

            <div class="cart-item-info">
                <span>
                    ${producto.categoria}
                </span>

                <h3>
                    Diseño ${String(producto.numero).padStart(2, "0")}
                </h3>

                <p>
                    Cantidad: ${producto.cantidad}
                </p>

                <strong>
                    COTIZACIÓN
                </strong>
            </div>

            <button
                type="button"
                class="remove-item"
                onclick="eliminarDelCarrito('${producto.id}')"
                aria-label="Eliminar producto"
            >
                ×
            </button>
        `;

        cartItems.appendChild(item);
    });
}

function eliminarDelCarrito(id) {
    carrito = carrito.filter(
        producto => producto.id !== id
    );

    guardarCarrito();
    actualizarCarrito();
}

function vaciarCarrito() {
    if (carrito.length === 0) return;

    const confirmar = confirm(
        "¿Quieres vaciar todo tu carrito?"
    );

    if (!confirmar) return;

    carrito = [];

    guardarCarrito();
    actualizarCarrito();
}

function abrirCarrito() {
    const overlay = document.getElementById("cartOverlay");

    if (!overlay) return;

    actualizarCarrito();

    overlay.classList.add("active");
    document.body.classList.add("modal-open");
}

function cerrarCarrito() {
    const overlay = document.getElementById("cartOverlay");

    if (!overlay) return;

    overlay.classList.remove("active");
    document.body.classList.remove("modal-open");
}

function guardarCarrito() {
    localStorage.setItem(
        "printsCarrito",
        JSON.stringify(carrito)
    );
}

function cargarCarrito() {
    const guardado = localStorage.getItem(
        "printsCarrito"
    );

    if (!guardado) {
        carrito = [];
        return;
    }

    try {
        carrito = JSON.parse(guardado);

        if (!Array.isArray(carrito)) {
            carrito = [];
        }
    } catch (error) {
        carrito = [];
    }
}

function hacerPedido() {
    /*
       CAMBIA ESTE NÚMERO POR TU WHATSAPP
       Ejemplo México:
       521XXXXXXXXXX
    */
    const telefono = "5210000000000";

    if (carrito.length === 0) {
        alert(
            "Agrega al menos un diseño a tu carrito."
        );
        return;
    }

    let mensaje =
        "Hola PRINTS 👋\n\n" +
        "Quiero solicitar una cotización para:\n\n";

    carrito.forEach((producto, index) => {
        mensaje +=
            `${index + 1}. ` +
            `${producto.categoria} - ` +
            `Diseño ${String(producto.numero).padStart(2, "0")} ` +
            `x${producto.cantidad}\n`;
    });

    mensaje +=
        "\nSolicito cotización de las prendas." +
        "\n\nGracias.";

    window.open(
        `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`,
        "_blank"
    );
}

function enviarFormulario(event) {
    event.preventDefault();

    const nombre =
        document.getElementById("nombre").value.trim();

    const prenda =
        document.getElementById("prenda").value;

    const mensaje =
        document.getElementById("mensaje").value.trim();

    if (!nombre || !prenda || !mensaje) {
        alert(
            "Completa todos los campos antes de enviar."
        );
        return;
    }

    const telefono = "5210000000000";

    const texto =
        `Hola PRINTS 👋\n\n` +
        `Mi nombre es: ${nombre}\n` +
        `Me interesa una: ${prenda}\n\n` +
        `Mi idea es:\n${mensaje}\n\n` +
        `Me gustaría solicitar una cotización.`;

    window.open(
        `https://wa.me/${telefono}?text=${encodeURIComponent(texto)}`,
        "_blank"
    );
}

function abrirMenu() {
    const navMenu =
        document.getElementById("navMenu");

    if (navMenu) {
        navMenu.classList.toggle("active");
    }
}

document.addEventListener(
    "keydown",
    event => {
        if (event.key === "Escape") {
            cerrarGaleria();
            cerrarCarrito();
        }
    }
);

document.addEventListener(
    "DOMContentLoaded",
    () => {
        cargarCarrito();
        actualizarCarrito();
    }
);