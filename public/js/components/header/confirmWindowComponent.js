
let confirmWindowComponent = Vue.component("confirm-window-component", {

    template:
    `<div class="modal" id="confirmWindow" tabindex="-1">
              <div class="modal-dialog modal-sm">
          <div class="modal-content text-center">
            <div class="modal-header bg-danger text-white d-flex justify-content-center">
              <h5 class="modal-title" id="exampleModalLabel">¿Seguro que quieres salir?</h5>
            </div>
            <div class="modal-body">
            Tus datos de perfil podrían perderse <i class="fas fa-times fa-3x text-danger"></i>
            </div>
            <div class="modal-footer d-flex justify-content-center">
              <button type="button" class="btn btn-danger" v-on:click="cerrarVentana();">No</button>
              <button type="button" class="btn btn-outline-danger" v-on:click="logout();">Sí</button>
            </div>
          </div>
        </div>
      </div>`,
      methods: {
        cerrarVentana(){
            this.$emit("cerrarVentana", {});
        },
        logout(){
            this.$emit("logout", {});
        }
        
    }
  });
  
  export default {
    confirmWindowComponent
  }
