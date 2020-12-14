import './playGameComponent.js';
import './selectionComponent.js';


let gameComponent = Vue.component("game-component", {
    data: function () {
        return {
            startedGame: false,
            nombre: '',
            codigo: -1,
            modo: -1,
            socket: ''

        }
    },
    template: `
    <div>
        <div class="container">
            <div v-if="startedGame === false">
                <selection-component v-on:start="startGame"></selection-component>
            </div>
            <div v-else>
                <play-game-component v-bind:name="nombre" v-bind:code="codigo" v-bind:mode="modo" v-bind:socket="socket" v-on:end="endGame"></play-game-component>
            </div>
        </div>
    </div>`,
    async created() {
        this.modo = sessionStorage.getItem("partida_modo");
        this.nombre = sessionStorage.getItem("partida_nombre");
        this.codigo = sessionStorage.getItem("partida_codigo");

        this.socket = await io();
        if (this.nombre !== "" && this.nombre !== null) {
            this.startedGame = true;
        }
        
    },
    mounted(){
        if (this.startedGame === false){
            document.getElementById("footer").style.position = "absolute";
        }else{
            document.getElementById("footer").style.position = "relative";
        }
    },
    methods: {

        connectServer() {
            let code = "";
            this.socket.on("id_conexion", (data) => {
                code = data;
            });

            this.code = code;
        },
        startGame(dat) {
            this.startedGame = true;
            this.modo = Number(dat.modo);
            this.nombre = dat.nombre;
            this.codigo = dat.codigo;

            if (this.codigo === "" || this.codigo === null)
                this.connectServer();
            
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
        }

        
    }
})
export default gameComponent;
