
let aboutComponent = Vue.component("about-component", {
  template:
    `
      <div class="d-flex justify-content-center align-items-center row">
      <div class="col-8">
        <div class="text-center">
              <h2 class="h1 text-one" style="color: #6a8255;">Acerca de</h2>
              <p class="mt-5 text-two h4">Objetivo del proyecto: </p>
              <p class="mt-1 text-two h6">Proyecto realizado para la asignatura de Tecnologías del lado del Cliente, que pertenece al Máster en Informática Móvil de la UPSA. Está web se ha realizado únicamente con propósitos edudcativos, para poner en práctica los conocimientos adquiridos durante la asignatura, principalmente orientados a HTML, CSS y Javascript.</p>
              <p class="mt-5 text-two h6">Autor: Javier Martínez Arias</p>
        </div>
        </div>
      </div>`,

});

export default aboutComponent;


