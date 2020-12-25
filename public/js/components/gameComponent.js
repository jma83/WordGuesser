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
                <play-game-component v-bind:name="nombre" v-bind:code="getCode()" v-bind:mode="modo" v-bind:socket="connection.socket" v-bind:socketid="getId()" v-on:end="endGame"></play-game-component>
            </div>
        </div>
    </div>`,
    async created() {
        this.modo = sessionStorage.getItem("partida_modo");
        this.nombre = sessionStorage.getItem("partida_nombre");
        
        if (this.checkValid(this.nombre)) {
            this.startedGame = true;
        }
        
    },
    mounted(){
        this.responsive();
        this.connection.setCode(sessionStorage.getItem("partida_codigo"));
    },
    updated(){
        if (this.checkValid(this.connection.code))
        sessionStorage.setItem("partida_codigo", this.connection.code);

    },
    methods: {

        startGame(dat) {
            this.startedGame = true;
            this.modo = Number(dat.modo);
            this.nombre = dat.nombre;

            

            if(this.connection.socket.connected){
                if (this.checkValid(dat.codigo) && this.modo===0)
                this.connection.initConection(dat.codigo);
                else
                this.connection.initConection();
            }

            
            
            sessionStorage.setItem("partida_modo", this.modo);
            sessionStorage.setItem("partida_nombre", this.nombre);
            this.responsive();
        },
        endGame(){
            sessionStorage.clear();
            this.startedGame = false;
            this.responsive();
        },
        getCode(){
            if (this.checkValid(this.connection.code))
            return this.connection.code.substr(0, 5);

            return '';

        },
        getId(){
            return this.connection.id;
        },
        
        checkValid(val){
            if (val !== null && val !== ""){
                return true;
            }
            return false;
        },
        responsive(){
            if (this.startedGame === false && this.nombre === null){
                document.getElementById("footer").style.position = "absolute";
            }else{
                document.getElementById("footer").style.position = "relative";
            }
        }
        
    }
})
export default gameComponent;
