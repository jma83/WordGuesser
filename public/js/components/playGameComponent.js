import './playerInfoComponent.js';
import './imageInfoComponent.js';
import './lobbyComponent.js';

let playGameComponent = Vue.component("play-game-component", {
    props: ["name", "code", "mode", "socket", "socketid", "estado"],
    data: function () {
        return {
            //gm: new GameManager(this.dificultad),
            idmsg: 0,
            arrayLetras: [],
            victorias: 3,
            host: '',
            msgCabecera: "Encuentra la palabra oculta!",
            descripcion: "Bienvenido al chat! Aqui quedarán registrados los mensajes y respuestas de todos los usuarios!",
            timer: 0,
            players: [],
            connected: false,
            siguienteRonda: false

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
                        <p><i>{{this.descripcion}}</i></p>
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
                <button v-if="Number(this.mode)===1 && this.estado === 0" type="input" v-on:click.prevent="ajustes()" class="btn btn-primary col-4 col-md-3 col-lg-2 mr-2 align-self-end" id="ajustes" name="ajustes" data-dif="2"><i class="fas fa-cog"></i> &nbsp;Ajustes de partida</button>
                <button v-if="this.estado === 0 || this.siguienteRonda===true" type="input" v-on:click.prevent="siguiente()" class="btn btn-info col-4 col-md-3 col-lg-2 mr-2 " id="siguiente" name="siguiente" data-dif="2"><i class="fas fa-check-circle"></i> &nbsp; Siguiente</button>
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
            
            //console.log("conexion_sala");
            //console.log("updated! id:" + id)

            this.connected = true;
            this.emitir('conexion_sala');
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
            this.emitir('desconexion_sala');
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
            this.emitir('siguiente');
        },
        getPlayers() {
            this.socket.on("listPlayers", (p) => {
                console.log("listPlayers ")
                console.log(p)
                this.players = [];
                let checkSiguientes = true;
                for (let i = 0; i < p.listPlayers.length; i++) {
                    let name = p.listPlayers[i];
                    let siguiente = p.listSiguiente[i];

                    if (siguiente===false) checkSiguientes = false;

                    this.players.push({name,siguiente});
                }

                if (checkSiguientes && p.listSiguiente.length > 1){
                    this.$emit("cambioEstado", 1);
                }
            });
        },
        emitir(str){
            let codigoPartida = this.code;
            let tipoUsuario = this.mode;
            let nombre = this.name;
            let id = this.socketid || this.socket.id;
            let endGameMethod = true;
            this.socket.emit(str, { id, codigoPartida, nombre, tipoUsuario, endGameMethod });
        }
        
    }
});

export default playGameComponent;