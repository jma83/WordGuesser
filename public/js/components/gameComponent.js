import './playGameComponent.js';
import './selectionComponent.js';
import Conexion from '../connectionClass.js';
import ConnectionEvents from '../connectionEvents.js';


let gameComponent = Vue.component("game-component", {
    props: ["eventBus"],
    data: function () {
        return {
            startedGame: false,
            nombre: '',
            modo: -1,
            connection: new Conexion(),
            event: '',
            checkVolver: false
        }
    },
    template: `
    <div ref="gameComponent">
        <div class="container">
            <div v-if="startedGame === false">
                <selection-component v-on:start="startGame"></selection-component>
            </div>
            <div v-else>
                <play-game-component ref="playgame" v-bind:name="nombre" v-bind:code="getCode()" v-bind:mode="modo" v-bind:socket="connection.socket" v-bind:socketid="getId()" v-bind:players="this.event.players" v-bind:serverInfo="this.event.roomClient.data" v-on:enviarTexto="enviarTexto" v-on:siguiente="siguiente" v-on:connectRoom="connectRoom" v-on:end="endGame" v-on:setServerInfo="setServerInfo"></play-game-component>
            </div>
        </div>
    </div>`,
    async created() {
        if (this.checkValid(sessionStorage.getItem("partida_codigo")))
            this.connection.setCode(sessionStorage.getItem("partida_codigo"), true);
        if (this.checkValid(sessionStorage.getItem("partida_id")))
            this.connection.setId(sessionStorage.getItem("partida_id"), true);

        this.event = new ConnectionEvents(this.connection);
        this.modo = sessionStorage.getItem("partida_modo");
        this.nombre = sessionStorage.getItem("partida_nombre");
        this.event.setCurrent(this.nombre, this.modo);
        this.event.updatePlayers();
        this.event.updateServerInfo();

        console.log("CREATED!")


        if (this.checkValid(this.nombre)) {
            this.startedGame = true;
        }
        //console.log("mounted id:" + sessionStorage.getItem("partida_id"))
    },
    mounted() {
        this.responsive();
    },
    updated() {
        if (this.checkValid(this.connection.getCode()))
            sessionStorage.setItem("partida_codigo", this.connection.getCode());

        if (this.checkValid(this.connection.getId())) {
            sessionStorage.setItem("partida_id", this.connection.getId());
        } else if (this.checkValid(this.connection.socket.id)) {
            sessionStorage.setItem("partida_id", this.connection.socket.id);
        }
        console.log("update")
    },

    beforeDestroy() {
        this.event.removeListeners();
        console.log("remove listeners!")
    },

    methods: {

        startGame(dat) {
            if (this.checkVolver) {
                this.event = new ConnectionEvents(this.connection);
                this.checkVolver = false;
            }
            this.startedGame = true;
            this.modo = Number(dat.modo);
            this.nombre = dat.nombre;
            this.event.setCurrent(dat.nombre, this.modo);
            if (this.checkValid(dat.codigo) && this.modo === 0) {
                this.connection.initConection(dat.codigo);
            } else {
                this.connection.initConection();
            }

            sessionStorage.setItem("partida_modo", this.modo);
            sessionStorage.setItem("partida_nombre", this.nombre);
            this.responsive();

            if (this.checkValid(localStorage.getItem("nombre"))) {
                console.log("setNombre")
                this.eventBus.$emit("setNombre");
            }
        },
        endGame() {
            this.startedGame = false;
            this.nombre = null;
            this.event.disconectRoom();

            this.event.roomClient.setDefaultValues();

            sessionStorage.clear();
            this.connection.startConnection();
            this.connection.restartValues();
            this.checkVolver = true;
            this.responsive();

        },
        connectRoom() {
            this.event.connectRoom();
        },
        siguiente() {
            this.event.siguiente();
        },
        enviarTexto() {
            this.event.enviarTexto();
        },
        getCode() {
            if (this.checkValid(this.connection.getCode()))
                return this.connection.getCode().substr(0, 5);

            return '';

        },
        getId() {
            return this.connection.getId();
        },

        checkValid(val) {
            if (val != null && val !== "" && Number(val) !== 0) {
                return true;
            }
            return false;
        },
        responsive() {
            if (this.startedGame === false && this.nombre === null) {
                document.getElementById("footer").style.position = "absolute";
            } else {
                document.getElementById("footer").style.position = "relative";
            }
        },
        setServerInfo(dat) {
            this.event.roomClient.setValues(dat);
            console.log("tipo " + dat.tipo)
            console.log("dificultad " + dat.dificultad)
        }

    }
})
export default gameComponent;
