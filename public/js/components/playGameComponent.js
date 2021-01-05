import './playerInfoComponent.js';
import './imageInfoComponent.js';
import './lobbyComponent.js';

let playGameComponent = Vue.component("play-game-component", {
    props: ["name", "code", "mode", "socket", "socketid", "serverInfo"],
    data: function () {
        return {
            //gm: new GameManager(this.dificultad),
            idmsg: 0,
            arrayLetras: [],
            victorias: 3,
            host: '',
            msgCabecera: "Encuentra la palabra oculta!",
            descripcion: "Bienvenido al chat! Aqui quedarán registrados los mensajes y respuestas de todos los usuarios!",
            timer: 100,
            players: [],
            connected: false,

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
                    <image-info-component v-if="this.serverInfo.estado === 1" v-bind:image="this.serverInfo.imagen" v-bind:palabra="this.serverInfo.palabra"></image-info-component>
                    <lobby-component v-if="this.serverInfo.estado === 0" v-bind:id="this.getId()" v-bind:players="players"></lobby-component>
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
                    <player-info-component v-bind:name="name" v-bind:timer="timer" v-bind:victorias="victorias" v-if="this.serverInfo.estado === 1"></player-info-component>
                </div>
                <form class="col-10 col-md-3 mt-2 p-2 align-self-start">
                    <div class="form-group">
                        <label for="name" >Chat de respuestas: </label>
                        <input type="text" class="form-control" placeholder="Introduce texto" aria-label="mensaje"
                            id="mensaje" name="mensaje" maxlength="30">
                    </div>
                    <button type="submit"  v-on:click.prevent="enviarTexto()" class="btn btn-primary mt-2"><i class="far fa-paper-plane"></i> &nbsp; Enviar</button>
                </form>
            </div>
            <div class="row justify-content-end">
                <button v-if="Number(this.mode)===1 && this.serverInfo.estado === 0" type="input" v-on:click.prevent="ajustes()" class="btn btn-primary col-4 col-md-3 col-lg-2 mr-2 align-self-end" id="ajustes" name="ajustes" data-dif="2"><i class="fas fa-cog"></i> &nbsp;Ajustes de partida</button>
                <button v-if="this.serverInfo.estado === 0 || this.serverInfo.finRonda===true" type="input" v-on:click.prevent="siguiente()" class="btn btn-info col-4 col-md-3 col-lg-2 mr-2 " id="siguiente" name="siguiente" data-dif="2"><i class="fas fa-check-circle"></i> &nbsp; Siguiente</button>
            </div>
        </div>        
  </div>`,
    created() {
        this.getPlayers();
        this.getServerInfo();
    },
    mounted() {
        if (Number(this.mode) === 0) {
            this.host = "Invitado";
        } else if (Number(this.mode) === 1) {
            this.host = "Anfitrión";
        }

    },
    updated() {
        let id = this.getId();
        console.log("ID!!!! " + id);
        console.log("this.serverInfo.estado!!!! " + this.serverInfo.estado);
        if (id != null && id !== '' && this.connected === false && this.code !== '' && this.serverInfo.estado === 0) {
            
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
            this.connected = false;
            this.$emit("end", {});
        },
        enviarTexto() {
            let mensaje = document.getElementById("mensaje").value;
            let nombre = this.name;
            let codigoPartida = this.code;
            if (mensaje !== "" && mensaje !== null) {
                let idmsg = this.idmsg;
                document.getElementById("mensaje").value = "";
                this.socket.emit('mensaje', { idmsg, codigoPartida, nombre, mensaje });
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
                    let id = p.listIds[i];
                    let name = p.listPlayers[i];
                    let siguiente = p.listSiguiente[i];
                    

                    if (siguiente===false) checkSiguientes = false;

                    this.players.push({id, name, siguiente});
                }
                if (checkSiguientes && p.listSiguiente.length > 0 && Number(this.mode)===1){
                    //this.$emit("cambioEstado", 1);
                    console.log('cambiarEstadoServer')
                    this.emitir('cambiarEstadoServer');
                }
            });
        },
        getServerInfo() {
            this.socket.on("serverInfo", (data) => {
                console.log('serverInfo' + data.palabra)
                this.$emit("setServerInfo", data);
            });
        },
        emitir(str){
            let codigoPartida = this.code;
            let tipoUsuario = this.mode;
            let nombre = this.name;
            let id = this.getId();
            let estado = this.serverInfo.estado;
            let endGameMethod = true;
            this.socket.emit(str, { id, codigoPartida, nombre, tipoUsuario, endGameMethod, estado });
        },
        
        getId(){
            return this.socketid || this.socket.id;
        }
    }
});

export default playGameComponent;