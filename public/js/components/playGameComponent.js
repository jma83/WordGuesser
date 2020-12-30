import './playerInfoComponent.js';
import './imageInfoComponent.js';
import './lobbyComponent.js';

let playGameComponent = Vue.component("play-game-component", {
    props: ["name", "code", "mode", "socket", "socketid"],
    data: function () {
        return {
            //gm: new GameManager(this.dificultad),
            idmsg: 0,
            arrayLetras: [],
            victorias: 3,
            host: '',
            valorInput: "",
            estadoPartida: 0,
            msgCabecera: "Encuentra la palabra oculta!",
            descripcion: "Bienvenido al chat! aqui se verán reflejadas las respuestas a la palabra secreta!",
            timer: 0,
            estado: 0,
            players: [],
            siguientes: [],
            connected: false

        }
    },
    template:
        `
        <div id="game" class="card p-4 m-4">
        
        <div class="row">
            <button type="input" v-on:click.prevent="endGameEvent()" class="btn btn-warning mr-1 col-4 col-lg-2 col-lg-1" id="volver" name="volver"><i class="fas fa-arrow-left"></i>&nbsp;Volver</button>
        </div>    
        <div id="maingame">
            <h2 class="row p-2 align-self-center justify-content-center">{{ this.host }} - Partida: {{this.code}}</h2>
            <div class="row">
                <div class="card col-12 col-md-6 justify-content-center align-self-start">
                    <image-info-component v-if="this.estado === 1"></image-info-component>
                    <lobby-component v-if="this.estado === 0" v-bind:name="name" v-bind:socket="socket" v-bind:players="players" v-bind:mode="mode" ></lobby-component>
                </div>
                <div class="col-md-1"></div>
                <div class="card col-12 col-md-5" id="chat_container">
                    <div class="alert alert-primary align-bottom" role="alert" id="chat">
                        <p><i>Bienvenido al chat! Aqui quedarán registrados los mensajes y respuestas de todos los usuarios!</i></p>
                    </div>
                </div>
            </div>
            
            <div class="row justify-content-around">
                <div class=" col-10 col-md-4 align-self-start mt-2 p-2 ">
                    <player-info-component v-bind:name="name" v-bind:timer="timer" v-bind:victorias="victorias" v-if="this.estado === 1"></player-info-component>
                </div>
                <form class="col-10 col-md-3 mt-2 p-2 align-self-start">
                    <div class="form-group">
                        <label for="name" >Chat de respuestas: </label>
                        <input type="text" class="form-control" placeholder="Introduce texto" aria-label="palabra"
                            id="palabra" name="palabra" maxlength="30">
                    </div>
                    <button type="submit"  v-on:click.prevent="enviarTexto()" class="btn btn-primary mt-2"><i class="far fa-paper-plane"></i> &nbsp; Enviar</button>
                </form>
            </div>
            <div class="row justify-content-end">
                    <button v-if="Number(this.mode)===1" type="input" v-on:click.prevent="ajustes()" class="btn btn-primary col-4 col-md-3 col-lg-2 mr-2 align-self-end" id="ajustes" name="ajustes" data-dif="2"><i class="fas fa-cog"></i> &nbsp;Ajustes de partida</button>
                <button type="input" v-on:click.prevent="siguiente()" class="btn btn-info col-4 col-md-3 col-lg-2 mr-2 " id="siguiente" name="siguiente" data-dif="2"><i class="fas fa-check-circle"></i> &nbsp; Siguiente</button>
            </div>
        </div>        
  </div>`,
    created() {
        this.getPlayers();
    },
    mounted() {
        if (Number(this.mode) === 0) {
            this.host = "Invitado";
        } else if (Number(this.mode) === 1) {
            this.host = "Anfitrión";
        }

    },
    updated() {
        let id = this.socketid || this.socket.id;

        if (id != null && id !== '' && this.connected === false && this.code !== '' && this.estado === 0) {
            let codigoPartida = this.code;
            let tipoUsuario = this.mode;
            let nombre = this.name;

            this.connected = true;
            console.log("conexion_sala");
            console.log("updated! id:" + id)

            this.socket.emit('conexion_sala', { id, codigoPartida, nombre, tipoUsuario });
        }
    },
    deactivated() {
        this.endGameEvent();
    },
    beforeUnmount() {
        this.endGameEvent();
    },
    methods: {
        endGameEvent() {
            let codigoPartida = this.code;
            let tipoUsuario = this.mode;
            let nombre = this.name;
            let id = this.socket.id || this.socketid;
            let endGameMethod = true;
            this.socket.emit('desconexion_sala', { id, codigoPartida, nombre, tipoUsuario, endGameMethod });
            this.$emit("end", {});
        },
        enviarTexto() {
            let palabra = document.getElementById("palabra").value;
            let nombre = this.name;
            let codigoPartida = this.code;
            if (palabra !== "" && palabra !== null) {
                let idmsg = this.idmsg;
                document.getElementById("palabra").value = "";
                this.socket.emit('mensaje', { idmsg, codigoPartida, nombre, palabra });
                this.idmsg++;
            }


        },
        siguiente() {
            let codigoPartida = this.code;
            let tipoUsuario = this.mode;
            let nombre = this.name;
            let id = this.socket.id || this.socketid;


            if (this.estado === 0)
                this.estado = 1;
            this.socket.emit('siguiente', { id, codigoPartida, nombre, tipoUsuario });
        },
        getPlayers() {
            this.socket.on("listPlayers", (p) => {
                console.log("listPlayers " + p.listPlayers)
                this.players = p.listPlayers;
                this.siguientes = p.listSiguiente;
            });
        }
    }
});

export default playGameComponent;