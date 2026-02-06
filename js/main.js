/* ======================================================
   MORALES FITPRO - MAIN JS
   Funciones generales del sitio
   ====================================================== */

(() => {

  // ==========================
  // AÑO AUTOMÁTICO FOOTER
  // ==========================
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ==========================
  // SCROLL SUAVE EN ANCLAS
  // ==========================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: "smooth"
        });
      }
    });
  });

  // ==========================
  // BOTON WHATSAPP (SI EXISTE)
  // ==========================
  const whatsappBtn = document.getElementById("btn-whatsapp");
  if (whatsappBtn) {
    whatsappBtn.addEventListener("click", () => {
      console.log("Contacto WhatsApp Morales FitPro");
    });
  }

})();


