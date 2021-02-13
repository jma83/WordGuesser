import './confirmWindowComponent.js';
import * as ConsClass from '../../constants.js'

let headerComponent = Vue.component("header-component", {
  props: ["eventBus"],
  data: function () {
    return {
      nombre: '',
      modalWindow: ''
    }
  },
  template:
    `<header>
      <nav class="mb-1 navbar navbar-expand-lg navbar-dark bg-dark">
      <router-link to="/" class="navbar-brand">
          <img src="./img/movie-icon-red.png" width="54" height="54" class="d-inline-block align-top float-left mr-3 ml-4 mb-2"
            alt="logo" />
          <h1 class="float-left">MovieGuessr</h1>
        </router-link>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent-4" aria-controls="navbarSupportedContent-4" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
      </button>
      <div class=" navbar-collapse" id="navbarSupportedContent-4">
          <ul class="navbar-nav ml-auto justify-content-end align-items-end">
              <li class="nav-item active">
                  <router-link to="/about" class="navbar-brand">
                      <i class="fas fa-question-circle "> </i> &nbsp; Acerca
                      <span class="sr-only">(current)</span>
                  </router-link>
              </li>
              <li class="nav-item dropdown" v-if="this.getNombre()!==''">
                  <a class="nav-link dropdown-toggle waves-effect waves-light navbar-brand" id="navbarDropdownMenuLink-4" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                      <i class="fas fa-user"></i>  &nbsp; {{this.getNombre()}} </a>
                  <div class="dropdown-menu dropdown-menu-right dropdown-info" aria-labelledby="navbarDropdownMenuLink-4">
                      <router-link to="/profile" class="dropdown-item waves-effect waves-light">Mi perfil</router-link>
                      <a v-on:click="confirmation()" class="dropdown-item waves-effect waves-light" >Salir</a>
                      
                  </div>
              </li>
          </ul>
      </div>
  </nav>
  <confirm-window-component v-on:logout="this.borrarSession" v-on:cerrarVentana="this.confirmation"></confirm-window-component>
  </header>`,
  mounted() {
    if (localStorage.getItem(ConsClass.LOCAL_NOMBRE) != null)
      this.nombre = localStorage.getItem(ConsClass.LOCAL_NOMBRE);
    this.eventBus.$on(ConsClass.EVENTBUS_NOMBRE, (n) => { this.nombre = n; });

    this.modalWindow = new mdb.Modal(document.getElementById(ConsClass.CONFIRM_WIN_ELEMENT));
  },
  methods: {
    getNombre() {
      return this.nombre;
    },
    confirmation() {
      this.modalWindow.toggle();
    },
    borrarSession() {
      sessionStorage.clear();
      localStorage.clear();
      location.reload();
    },
  }
});

export default {
  headerComponent,
}