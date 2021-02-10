import * as ConsClass from '../../constants.js'

let welcomeComponent = Vue.component("welcome-component", {
  template:
    `
      <div class="d-flex justify-content-center align-items-center">
        <div class="text-center">
            <template v-if="!this.comprobarSession() && !this.comprobarLocalStorage()">
              <h2 class="h1 text-one" style="color: #6a8255;">¡Bienvenid@!</h2>
              <p class="mt-5 text-two h4">¿Cúanto sabes de cine? <i class="far fa-meh-rolling-eyes"></i></p>
              <p class="mt-1 text-two h6">¡En MovieGuessr puedes demostrar tus concimientos! <br>
              Reta a tus amigos y adivina de qué pelicula, serie o actor se trata.</p>
              <p class="mt-1 text-two h6">¡Todo a partir de una imagen!</p>
            </template>
            <template v-if="this.comprobarLocalStorage() && !this.comprobarSession()">
              <h2 class="h1 text-one" style="color: #6a8255;">¡Hola {{ this.getNombreLocal() }}!</h2>
              <p class="mt-5 text-two h4">¡Comienza una partida en solitario o con amigos! <i class="fa fa-rocket"></i></p>
            </template>
            <template v-if="this.comprobarSession()">
              <h2 class="h1 text-one" style="color: #6a8255;">¡Hola de nuevo {{ this.getSession() }}!</h2>
              <p class="mt-5 text-two h4">¡Continúa tu partida donde la has dejado! <i class="fa fa-gamepad "></i></p>
            </template>
            <router-link to="/game" class="btn btn-danger text-white btn-rounded btn-lg mt-4" href=""><i
                      class="fas fa-play"></i> JUGAR</router-link>
        </div>
      </div>`,
      mounted() {
          document.getElementById(ConsClass.FOOTER_ELEMENT).style.position = "absolute";
      },
      methods:{
        getSession() {
          let nombre = sessionStorage.getItem(ConsClass.SESION_NOMBRE);
          return nombre || "";
        },
        comprobarSession(){
          let nombre = sessionStorage.getItem(ConsClass.SESION_NOMBRE);
          if (nombre !== '' && nombre != null) {
            return true;
          }
          return false;
        },
        comprobarLocalStorage() {
          let nombre = localStorage.getItem(ConsClass.LOCAL_NOMBRE);
          if (nombre !== '' && nombre != null) {
            return true;
          }
          return false;
        },
    
        getNombreLocal() {
          let nombre = localStorage.getItem(ConsClass.LOCAL_NOMBRE);
          return nombre || "";
        }

    }
});

export default welcomeComponent;


