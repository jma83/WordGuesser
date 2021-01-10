

let selectionComponent = Vue.component("selection-component", {
  template:
    `
    <div class="container">
    <div class="d-flex justify-content-center align-items-center">
      <div class="text-center">
        <div id="seleccionInicial" class="card p-4 m-4">
          <h2 class="row p-2 justify-content-center">Indica tu nombre y a jugar!</h2>
          <form >
            <!--
            <div class="form-outline mb-4 ">
              <input type="text" id="form1Example1" class="form-control border" />
              <label class="form-label" for="form1Example1">Nombre</label>
            </div>
          
            <div class="form-outline mb-4 ">
              <input type="text" id="form1Example2" class="form-control border" />
              <label class="form-label" for="form1Example2">Password</label>
            </div>-->
            <div v-if="!this.comprobarLocalStorage()">
              <div class="col d-flex justify-content-center">
                <div class="form-outline mb-4 mt-2">
                  <input type="text" class="form-control border" id="nombre" name="nombre"/>
                  <label class="form-label" for="nombre">Nombre</label>
                  <input class="form-check-input" type="checkbox" id="recordarNombre" />
                  <label class="form-check-label" for="recordarNombre">Recordar</label>
                </div>
              </div>
            </div>
            <div class="col-9  mt-2 justify-content-start" v-else><p>Nombre: <b>{{this.getNombre()}}</b></p></div>

            <div class="col d-flex justify-content-center">
              <div class="form-outline mb-4 ">
                <input type="text" class="form-control border" id="codigo" name="codigo"/>
                <label class="form-label" for="codigo">Código de partida</label>
              </div>
            </div>
            <p id="error" class="text-danger"></p>

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
            <!-- Submit button -->
          </form>
         
        </div>
      </div>
    </div>
  </div>`,
  methods: {
    startGameEvent(e) { //Al pulsar en alguno de los botones empieza el juego!
      let modo = e.target.dataset.mode;
      let nombre = this.getNombre();
      let recordarNombre = false;
      if (document.getElementById("nombre") != null) {
        nombre = document.getElementById("nombre").value;
        let recordarNombre = document.getElementById("recordarNombre").checked;
        if (recordarNombre) {
          localStorage.setItem("nombre", nombre);
        }

      }


      let codigo = document.getElementById("codigo").value;

      console.log({ modo, nombre, codigo });


      if (nombre === "" || nombre === null) {
        document.getElementById("error").innerText = "Error! Por favor, completa el nombre";
        return -1;
      }
      if (Number(modo) === 0 && codigo === "" || codigo === null) {
        document.getElementById("error").innerText = "Error! Por favor, completa el código de partida para unirte";
        return -1;
      }
      this.$emit("start", { modo, nombre, codigo });

    },

    comprobarLocalStorage() {
      let nombre = localStorage.getItem("nombre");
      console.log("nombre " + nombre)
      if (nombre !== '' && nombre != null) {
        console.log("true")
        return true;
      }
      return false;
    },

    getNombre() {
      let nombre = localStorage.getItem("nombre");
      if (nombre !== '' && nombre != null) {
        return nombre;
      }
      return nombre;
    }
  }
});

export default selectionComponent;


