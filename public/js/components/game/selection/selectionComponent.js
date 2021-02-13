import * as ConsClass from '../../../constants.js'
import Utils from '../../../utils.js'


let selectionComponent = Vue.component("selection-component", {
  data: function () {
    return {
      nombre: "",
      codigo: "",
      recordar: "",
      error: ""
    }
  },
  template:
    `
    <div class="container">
    <div class="d-flex justify-content-center align-items-center">
      <div class="text-center">
        <div id="seleccionInicial" class="card p-4 m-4">
          <h2 class="row p-2 justify-content-center">Indica tu nombre y a jugar!</h2>
          <form >
            <div v-if="!this.comprobarLocalStorage()">
              <div class="col d-flex justify-content-center">
                <div class="form-outline mb-4 mt-2">
                  <input type="text" class="form-control border" id="nombre" name="nombre" v-model="nombre"/>
                  <label class="form-label" for="nombre">Nombre</label>
                  <input class="form-check-input" type="checkbox" id="recordarNombre" v-model="recordar"/>
                  <label class="form-check-label" for="recordarNombre">Recordar</label>
                </div>
              </div>
            </div>
            <div class="col-9  mt-2 justify-content-start" v-else><p>Nombre: <b>{{this.getNombre()}}</b></p></div>

            <div class="col d-flex justify-content-center">
              <div class="form-outline mb-4 ">
                <input type="text" class="form-control border" id="codigo" name="codigo" v-model="codigo"/>
                <label class="form-label" for="codigo">Código de partida</label>
              </div>
            </div>
            <p id="error" class="text-danger">{{ this.error }}</p>

            <div class="col d-flex justify-content-center">
              <div class="form-outline mb-2 ">
                <button type="submit" v-on:click.prevent="startGameEvent($event)" class="btn btn-primary btn-block" id="unirse" name="unirse" data-mode="0">Unirse a partida</button>
              </div>
            </div>
            <div class="col d-flex justify-content-center">
              <div class="form-outline mb-2">
                <button type="submit" v-on:click.prevent="startGameEvent($event)" class="btn btn-danger btn-block" id="crear" name="crear" data-mode="1">Crear partida</button>
              </div>
            </div>
          </form>
         
        </div>
      </div>
    </div>
  </div>`,
  methods: {

    startGameEvent(e) { //Al pulsar en alguno de los botones empieza el juego!
      let modo = e.target.dataset.mode;
      let nombre = this.getNombre() || this.nombre;
      let codigo = this.codigo;

      if (this.validarCampos(nombre,codigo,modo)) {

        if (this.recordar) 
          localStorage.setItem(ConsClass.LOCAL_NOMBRE, nombre);
        
        this.$emit(ConsClass.START_EMIT, { modo, nombre, codigo });
      }

    },
    validarCampos(nombre,codigo,modo) {
      if (!Utils.checkValid(nombre)) {
        this.error = "Error! Por favor, completa el nombre";
        return false;
      }
      if (Number(modo) === 0 && !Utils.checkValid(codigo)) {
        this.error = "Error! Por favor, completa el código de partida para unirte";
        return false;
      }
      return true;
    },

    comprobarLocalStorage() {
      return Utils.comprobarLocalStorage();
    },

    getNombre() {
      return Utils.getNombreLocal();
    }
  }
});

export default selectionComponent;


