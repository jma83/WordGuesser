import './modAjustesComponent.js';

let ventanaComponent = Vue.component("ventana-component", {
  props: ["tiempoAux"],

    template:
      `<div class="modal" id="myModal" tabindex="-1">
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
            <mod-ajustes-component v-bind:tiempoAux="this.tiempoAux"></mod-ajustes-component>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" id="btn-save">Guardar cambios</button>
          </div>
        </div>
      </div>
    </div>`,
    mounted(){
        document.getElementById("btn-close").addEventListener('click', () => this.cerrarVentana());
        document.getElementById("btn-save").addEventListener('click', () => this.guardarCambios());
        let slider = document.getElementById('sliderTiempo');
        slider.addEventListener("change",()=>{
          let value= document.getElementById('sliderTiempo').value;
          this.$emit("setTiempo", value);
        });
    },
    methods: {
        cerrarVentana(){
            this.$emit("ajustes", {});
        },
        guardarCambios(){
            this.$emit("modificarAjustesSala", {});
        }
        
    }
  });
  
  export default {
    ventanaComponent
  }
  
  
  