import './play/playGameComponent.js';
import './selection/selectionComponent.js';
import Conexion from '../../game/connectionClass.js';
import ConnectionEvents from '../../game/connectionEvents.js';
import * as ConsClass from '../../constants.js'
import Utils from '../../utils.js'

let gameComponent = Vue.component("game-component", {
    props: ["eventBus"],
    data: function () {
        return {
            startedGame: false,
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
                <play-game-component v-bind:mensajesChat="this.event.roomClient.mensajesChat" v-bind:code="this.event.getCode()" v-bind:mode="this.event.roomClient.currentMode" v-bind:socketid="this.event.getId()" v-bind:players="this.event.roomClient.players" v-bind:serverInfo="this.event.roomClient.data" 
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
        if (Utils.checkValid(sessionStorage.getItem(ConsClass.SESION_CODIGO)))
            this.connection.setCode(sessionStorage.getItem(ConsClass.SESION_CODIGO), true);
        if (Utils.checkValid(sessionStorage.getItem(ConsClass.SESION_ID)))
            this.connection.setId(sessionStorage.getItem(ConsClass.SESION_ID), true);

        this.event = new ConnectionEvents(this.connection);
        let nombre = sessionStorage.getItem(ConsClass.SESION_NOMBRE);
        let modo = sessionStorage.getItem(ConsClass.SESION_MODO);
        this.event.roomClient.setCurrent(nombre, modo);


        if (Utils.checkValid(nombre)) {
            this.startedGame = true;
        }
    },
    mounted() {
        this.responsive();
    },
    updated() {
        if (Utils.checkValid(this.connection.getCode()))
            sessionStorage.setItem(ConsClass.SESION_CODIGO, this.connection.getCode());

        if (Utils.checkValid(this.connection.getId())) {
            sessionStorage.setItem(ConsClass.SESION_ID, this.connection.getId());
        } else if (Utils.checkValid(this.connection.socket.id)) {
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
            let modo = Number(dat.modo);
            this.event.roomClient.setCurrent(dat.nombre, modo);
            sessionStorage.setItem(ConsClass.SESION_MODO, modo);
            sessionStorage.setItem(ConsClass.SESION_NOMBRE, dat.nombre);

            if (Utils.checkValid(dat.codigo) && modo === 0) {
                this.connection.initConection(dat.codigo);
            } else {
                this.connection.initConection();
            }
 
            let localNombre = localStorage.getItem(ConsClass.LOCAL_NOMBRE);
            if (Utils.checkValid(localNombre)) 
                this.eventBus.$emit(ConsClass.EVENTBUS_NOMBRE, localNombre);
            

            this.responsive();
        },
        endGame() {
            this.startedGame = false;
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
        enviarTexto(message) {
            this.event.enviarTexto(message);
        },
        modificarAjustesSala(data){
            this.event.modificarAjustesSala(data);
        },
        getCode() {
            if (Utils.checkValid(this.connection.getCode()))
                return this.connection.getCode().substr(0, 5);

            return '';

        },
        responsive() {
            if (this.startedGame === false) {
                Utils.responsive(false);
            } else {
                Utils.responsive(true);
            }
        },
        setServerInfo(dat) {
            this.event.roomClient.setValues(dat);
        }

    }
})
export default gameComponent;
