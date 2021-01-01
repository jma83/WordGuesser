import './playGameComponent.js';
import './selectionComponent.js';
import event from '../connectionEvents.js';


let gameComponent = Vue.component("game-component", {
    data: function () {
        return {
            startedGame: false,
            nombre: '',
            modo: -1,
            event: event,
            connection: event.getConnection(),
            estado: 0,

        }
    },
    template: `
    <div ref="gameComponent">
        <div class="container">
            <div v-if="startedGame === false">
                <selection-component v-on:start="startGame"></selection-component>
            </div>
            <div v-else>
                <play-game-component ref="playgame" v-bind:name="nombre" v-bind:code="getCode()" v-bind:mode="modo" v-bind:socket="connection.socket" v-bind:socketid="getId()" v-bind:estado="estado" v-on:end="endGame" v-on:cambioEstado="cambioEstado"></play-game-component>
            </div>
        </div>
    </div>`,
    async created() {
        this.modo = sessionStorage.getItem("partida_modo");
        this.nombre = sessionStorage.getItem("partida_nombre");
        this.event.setCode(sessionStorage.getItem("partida_codigo"));
        this.event.setId(sessionStorage.getItem("partida_id"));

        if (this.checkValid(this.nombre)) {
            this.startedGame = true;
        }
        console.log("mounted id:" + sessionStorage.getItem("partida_id"))
    },
    mounted(){
        this.responsive();
    },
    updated(){
        if (this.checkValid(this.event.getCode()))
            sessionStorage.setItem("partida_codigo", this.event.getCode());
        
        if (this.checkValid(this.event.getId()))
            sessionStorage.setItem("partida_id", this.event.getId());
        else if (this.checkValid(this.connection.socket.id)){
            sessionStorage.setItem("partida_id", this.connection.socket.id);
        }

    },
    methods: {

        startGame(dat) {
            this.startedGame = true;
            this.modo = Number(dat.modo);
            this.nombre = dat.nombre;

            if(this.event.getConnection().socket.connected){
                if (this.checkValid(dat.codigo) && this.modo===0)
                this.event.initConection(dat.codigo);
                else
                this.event.initConection();
            }
                
            sessionStorage.setItem("partida_modo", this.modo);
            sessionStorage.setItem("partida_nombre", this.nombre);
            this.responsive();
        }, 
        endGame(){
            sessionStorage.clear();
            this.startedGame = false;
            this.cambioEstado(0);
            this.responsive();
            if (this.event !== undefined)
            this.event.startConnection();
        },
        getCode(){
            if (this.checkValid(this.event.getCode()))
            return this.event.getCode().substr(0, 5);

            return '';

        },
        getId(){
            return this.event.getId();
        },
        
        checkValid(val){
            if (val != null && val !== "" && Number(val) !== 0){
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
        },
        cambioEstado(dat){
            this.estado = dat;
        }
        
    }
})
export default gameComponent;
