import './modAjustesComponent.js';

let ventanaComponent = Vue.component("ventana-component", {
  props: ["serverInfo"],

    template:
      `<div class="modal" id="modalAjustes" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Ajustes partida</h5>
            <button
              id="btn-close"
              type="button"
              class="btn-close"
              data-mdb-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <mod-ajustes-component v-bind:serverInfo="this.serverInfo" v-on:modificarAjustesSala="modificarAjustesSala"></mod-ajustes-component>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" id="btn-save">Guardar cambios</button>
          </div>
        </div>
      </div>
    </div>`,

    methods: {

        modificarAjustesSala(data){
            this.$emit("modificarAjustesSala", data);
        }
        
    }
  });
  
  export default {
    ventanaComponent
  }
  
  
  