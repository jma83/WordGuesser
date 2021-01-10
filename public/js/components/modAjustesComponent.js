let modAjustesComponent = Vue.component("mod-ajustes-component", {
    props: ["tiempoAux"],
    template:
        `<form class="p-4 ">
            <!--<div class="form-check form-switch mb-4">
                <input class="form-check-input" type="checkbox" id="privacidad"  />
                <label class="form-check-label" for="privacidad">Partida pública</label>
                
            </div>-->
            <div class="form-outline mb-4">
                <label class="form-label " for="jugadores">Nº de jugadores máximo</label>
                <select class="form-select" aria-label="Default select example" id="jugadores" >
                    <option class="players" value="2">2 jugadores</option>
                    <option class="players" value="4">4 jugadores</option>
                    <option class="players" value="6">6 jugadores</option>
                    <option class="players" value="8">8 jugadores</option>
                </select>

            </div>
            <div class="form-outline mb-4">
                <label class="form-label" for="rondas">Nº de rondas</label>
                <select class="form-select" aria-label="Default select example" id="rondas" >
                    <option class="rondas" value="2">2 rondas</option>
                    <option class="rondas" value="4">4 rondas</option>
                    <option class="rondas" value="6">6 rondas</option>
                    <option class="rondas" value="8">8 rondas</option>
                    <option class="rondas" value="10">10 rondas</option>
                </select>

            </div>
            <div class="form-outline mb-4">
                <label class="form-label" for="sliderTiempo" id="slider_value">Tiempo de ronda: {{ this.tiempoAux }}</label>
                <div class="range">
                <input type="range" class="form-range" min="20" max="60" id="sliderTiempo" />
                </div>
            </div>
            <div class="form-outline mb-4">
                <label class="form-label " for="dificultad">Ayuda de letras</label>
                <select class="form-select" aria-label="Default select example" id="dificultad" >
                    <option class="dif" value="0">Fácil</option>
                    <option class="dif" value="1">Normal</option>
                    <option class="dif" value="2">Difícil</option>
                    <option class="dif" value="3">Sin Sugerencias</option>
                </select>
            </div>
            
            <div class="form-outline">
                <label class="form-label" for="tipoRadio">Tipo de preguntas:</label>
                <div class="form-check">
                    <input class="form-check-input tipoRadio" type="radio" name="tipoRadio" id="tipo0" value="0"/>
                    <label class="form-check-label" for="tipo0"> Todo </label>
                </div>
                <div class="form-check">
                    <input class="form-check-input tipoRadio" type="radio" name="tipoRadio" id="tipo1" value="1" />
                    <label class="form-check-label" for="tipo1"> Películas </label>
                </div>
                <div class="form-check">
                    <input class="form-check-input tipoRadio" type="radio" name="tipoRadio" id="tipo2" value="2"  />
                    <label class="form-check-label" for="tipo2"> Series </label>
                </div>
                <div class="form-check">
                    <input class="form-check-input tipoRadio" type="radio" name="tipoRadio" id="tipo3" value="3"  />
                    <label class="form-check-label" for="tipo3"> Actores/actrices </label>
                </div>
            </div>
        </form>`,
});

export default {
    modAjustesComponent
}


