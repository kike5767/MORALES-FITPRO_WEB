/* ======================================
   MORALES FITPRO - MAIN JS FINAL
   ====================================== */

document.addEventListener("DOMContentLoaded", () => {

    const bajar = document.querySelector(".flecha-bajar");
    const subir = document.querySelector(".flecha-subir");

    /* =========================
       SCROLL HACIA ABAJO
    ========================= */
    if (bajar) {
        bajar.addEventListener("click", e => {
            e.preventDefault();
            window.scrollBy({
                top: window.innerHeight,
                behavior: "smooth"
            });
        });
    }

    /* =========================
       SCROLL HACIA ARRIBA
    ========================= */
    if (subir) {
        subir.addEventListener("click", e => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

});
