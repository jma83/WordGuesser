let modAjustesComponent = Vue.component("mod-ajustes-component", {
    props: ["serverInfo"],
    data: function () {
        return {
            maxPlayers: "",
            maxRondas: "",
            maxTiempo: "",
            dificultad: "",
            tipo: "",
            btnClose: "btn-close",
            btnSave: "btn-save",
            ajustes: "ajustes"
        }
    },
    template:
        `<form class="p-4 ">
            <div class="form-outline mb-4">
                <label class="form-label " for="jugadores">Nº de jugadores máximo</label>
                <select class="form-select" id="jugadores" v-model="maxPlayers">
                    <option class="players" value="2">2 jugadores</option>
                    <option class="players" value="4">4 jugadores</option>
                    <option class="players" value="6">6 jugadores</option>
                    <option class="players" value="8">8 jugadores</option>
                </select>

            </div>
            <div class="form-outline mb-4">
                <label class="form-label" for="rondas">Nº de rondas</label>
                <select class="form-select"  id="rondas" v-model="maxRondas">
                    <option class="rondas" value="2">2 rondas</option>
                    <option class="rondas" value="4">4 rondas</option>
                    <option class="rondas" value="6">6 rondas</option>
                    <option class="rondas" value="8">8 rondas</option>
                    <option class="rondas" value="10">10 rondas</option>
                </select>

            </div>
            <div class="form-outline mb-4">
                <label class="form-label" for="sliderTiempo" id="slider_value">Tiempo de ronda: {{ this.maxTiempo }}</label>
                <div class="range">
                <input type="range" class="form-range" min="20" max="60" id="sliderTiempo" v-model="maxTiempo"/>
                </div>
            </div>
            <div class="form-outline mb-4">
                <label class="form-label " for="dificultad">Ayuda de letras</label>
                <select class="form-select"  id="dificultad" v-model="dificultad" >
                    <option class="dif" value="0">Fácil</option>
                    <option class="dif" value="1">Normal</option>
                    <option class="dif" value="2">Difícil</option>
                    <option class="dif" value="3">Sin Sugerencias</option>
                </select>
            </div>
            
            <div class="form-outline">
                <label class="form-label" for="tipoRadio">Tipo de preguntas:</label>
                <div class="form-check">
                    <input class="form-check-input tipoRadio" type="radio" name="tipoRadio" id="tipo0" value="0" v-model="tipo"/>
                    <label class="form-check-label" for="tipo0"> Todo </label>
                </div>
                <div class="form-check">
                    <input class="form-check-input tipoRadio" type="radio" name="tipoRadio" id="tipo1" value="1" v-model="tipo"/>
                    <label class="form-check-label" for="tipo1"> Películas </label>
                </div>
                <div class="form-check">
                    <input class="form-check-input tipoRadio" type="radio" name="tipoRadio" id="tipo2" value="2"  v-model="tipo"/>
                    <label class="form-check-label" for="tipo2"> Series </label>
                </div>
                <div class="form-check">
                    <input class="form-check-input tipoRadio" type="radio" name="tipoRadio" id="tipo3" value="3"  v-model="tipo"/>
                    <label class="form-check-label" for="tipo3"> Actores/actrices </label>
                </div>
            </div>
        </form>`,
    mounted() {
        let ajustesEl = document.getElementById(this.ajustes);
        if (ajustesEl != null)
            ajustesEl.addEventListener('click', () => this.actualizarState());

        document.getElementById(this.btnClose).addEventListener('click',() =>  this.cerrarVentana());
        document.getElementById(this.btnSave).addEventListener('click', () => this.guardarCambios());
    },
    beforeDestroy(){
        //document.getElementById(this.btnClose).removeEventListener('click');


    },
    methods: {
        actualizarState() {
            this.maxPlayers = this.serverInfo.maxPlayers;
            this.maxRondas = this.serverInfo.maxRondas;
            this.dificultad = this.serverInfo.dificultad;
            this.maxTiempo = this.serverInfo.maxTiempo;
            this.tipo = this.serverInfo.tipo;

        },
        guardarCambios() {

            let maxPlayers = this.maxPlayers
            let maxRondas = this.maxRondas
            let maxTiempo = this.maxTiempo;
            let dificultad = this.dificultad;
            let tipo = this.tipo;

            this.$emit("modificarAjustesSala", { maxPlayers, maxRondas, maxTiempo, dificultad, tipo });
        },

        cerrarVentana() {
            this.$emit("modificarAjustesSala", null);
        }
    }
});

export default {
    modAjustesComponent
}


