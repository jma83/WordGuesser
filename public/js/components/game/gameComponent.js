import './play/playGameComponent.js';
import './selection/selectionComponent.js';
import Conexion from '../../game/connectionClass.js';
import ConnectionEvents from '../../game/connectionEvents.js';
import * as ConsClass from '../../constants.js'

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
                <play-game-component v-bind:code="getCode()" v-bind:mode="modo" v-bind:socketid="getId()" v-bind:players="this.event.roomClient.players" v-bind:serverInfo="this.event.roomClient.data" 
                v-on:enviarTexto="enviarTexto" 
                v-on:siguiente="siguiente" 
                v-on:connectRoom="connectRoom" 
                v-on:end="endGame" 
                v-on:setServerInfo="setServerInfo" 
                v-on:modificarAjustesSala="modificarAjustesSala">
                </play-game-component>
            </div>
        </div>
    </div>`,
    async created() {
        if (this.checkValid(sessionStorage.getItem(ConsClass.SESION_CODIGO)))
            this.connection.setCode(sessionStorage.getItem(ConsClass.SESION_CODIGO), true);
        if (this.checkValid(sessionStorage.getItem(ConsClass.SESION_ID)))
            this.connection.setId(sessionStorage.getItem(ConsClass.SESION_ID), true);

        this.event = new ConnectionEvents(this.connection);
        this.modo = sessionStorage.getItem(ConsClass.SESION_MODO);
        this.nombre = sessionStorage.getItem(ConsClass.SESION_NOMBRE);
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
            sessionStorage.setItem(ConsClass.SESION_CODIGO, this.connection.getCode());

        if (this.checkValid(this.connection.getId())) {
            sessionStorage.setItem(ConsClass.SESION_ID, this.connection.getId());
        } else if (this.checkValid(this.connection.socket.id)) {
            sessionStorage.setItem(ConsClass.SESION_ID, this.connection.socket.id);
        }
        console.log("update")
    },

    beforeDestroy() {
        this.event.removeListeners();
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

            sessionStorage.setItem(ConsClass.SESION_MODO, this.modo);
            sessionStorage.setItem(ConsClass.SESION_NOMBRE, this.nombre);
            this.responsive();

            if (this.checkValid(localStorage.getItem(ConsClass.LOCAL_NOMBRE))) {
                this.eventBus.$emit(ConsClass.EVENTBUS_NOMBRE);
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
        modificarAjustesSala(data){
            this.event.modificarAjustesSala(data);
        },
        getCode() {
            if (this.checkValid(this.connection.getCode()))
                return this.connection.getCode().substr(0, 5);

            return '';

        },
        getId() {
            return this.event.getId();
        },

        checkValid(val) {
            if (val != null && val !== "" && Number(val) !== 0) {
                return true;
            }
            return false;
        },
        responsive() {
            if (this.startedGame === false && this.nombre === null) {
                document.getElementById(ConsClass.FOOTER_ELEMENT).style.position = "absolute";
            } else {
                document.getElementById(ConsClass.FOOTER_ELEMENT).style.position = "relative";
            }
        },
        setServerInfo(dat) {
            this.event.roomClient.setValues(dat);
        }

    }
})
export default gameComponent;
