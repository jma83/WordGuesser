import './playGameComponent.js';
import './selectionComponent.js';
import connection from '../connectionEvents.js';


let gameComponent = Vue.component("game-component", {
    data: function () {
        return {
            startedGame: false,
            nombre: '',
            modo: -1,
            connection: connection
        }
    },
    template: `
    <div>
        <div class="container">
            <div v-if="startedGame === false">
                <selection-component v-on:start="startGame"></selection-component>
            </div>
            <div v-else>
                <play-game-component v-bind:name="nombre" v-bind:code="getCode()" v-bind:mode="modo" v-bind:socket="connection.socket" v-bind:socketid="connection.id" v-on:end="endGame"></play-game-component>
            </div>
        </div>
    </div>`,
    async created() {
        this.modo = sessionStorage.getItem("partida_modo");
        this.nombre = sessionStorage.getItem("partida_nombre");
        this.codigo = sessionStorage.getItem("partida_codigo");

        if (this.nombre !== "" && this.nombre !== null) {
            this.startedGame = true;
        }
        
    },
    mounted(){
        if (this.startedGame === false && this.nombre === null){
            document.getElementById("footer").style.position = "absolute";
        }else{
            document.getElementById("footer").style.position = "relative";
        }
    },
    methods: {

        startGame(dat) {
            //            connection.initConection();

            this.startedGame = true;
            this.modo = Number(dat.modo);
            this.nombre = dat.nombre;
            this.codigo = dat.codigo;
            
            if (this.codigo === "" || this.codigo === null){
                console.log("entro")

            }else{
                console.log("NO entro")
            }
            
            sessionStorage.setItem("partida_modo", this.modo);
            sessionStorage.setItem("partida_nombre", this.nombre);
            sessionStorage.setItem("partida_codigo", this.codigo);
            document.getElementById("footer").style.position = "relative";
            // console.log(dat)
        },
        endGame(){
            sessionStorage.clear();
            this.startedGame = false;
            document.getElementById("footer").style.position = "absolute";
        },
        getCode(){
            return this.connection.code.substr(0, 5);
        },

        
    }
})
export default gameComponent;
