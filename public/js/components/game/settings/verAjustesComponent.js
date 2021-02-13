let verAjustesComponent = Vue.component("ver-ajustes-component", {
    props: ["serverInfo"],
    template:
        `<div class="p-1 card">
            <h5>Ajustes</h5>
            <ul class="list-group list-group-horizontal-sm">
                <li class="list-group-item"><b>Nº de jugadores máximo: </b>{{this.serverInfo.maxPlayers}}</li>
                <li class="list-group-item"><b>Nº de rondas: </b>{{this.serverInfo.maxRondas}}</li>
                <li class="list-group-item"><b>Tiempo de ronda: </b>{{this.serverInfo.maxTiempo}} segundos</li>
            </ul>
            <ul class="list-group  list-group-horizontal-sm">
                <li class="list-group-item"><b>Ayuda de letras: </b>{{this.getDificultad()}}</li>
                <li class="list-group-item"><b>Tipo de preguntas: </b>{{this.getTipoPreguntas()}}</li>
            </ul>
        </div>`,
    mounted() {

    },
    methods: {
        getDificultad(){
            if (Number(this.serverInfo.dificultad)===0){
                return "Fácil";
            }else if (Number(this.serverInfo.dificultad)===1){
                return "Normal";
            }else if (Number(this.serverInfo.dificultad)===2){
                return "Difícil";
            }else if (Number(this.serverInfo.dificultad)===3){
                return "Sin sugerencias";
            }
        },

        getTipoPreguntas(){
            if (Number(this.serverInfo.tipo)===0){
                return "Todo";
            }else if (Number(this.serverInfo.tipo)===1){
                return "Peliculas";
            }else if (Number(this.serverInfo.tipo)===2){
                return "Series";
            }else if (Number(this.serverInfo.tipo)===3){
                return "Actores/actrices";
            }
        }
    }
});

export default {
    verAjustesComponent
}


