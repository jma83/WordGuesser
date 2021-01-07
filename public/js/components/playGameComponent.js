import './playerInfoComponent.js';
import './imageInfoComponent.js';
import './lobbyComponent.js';
import './titleComponent.js';

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
            intervalID: null,
        }
    },
    template:
        `
        <div id="game" class="card p-4 m-4">
        
        <div class="row">
            <button type="input" v-on:click.prevent="endGameEvent()" class="btn btn-warning mr-1 col-4 col-lg-2" id="volver" name="volver"><i class="fas fa-arrow-left"></i>&nbsp;Volver</button>
            <span class="col-4" v-if="this.serverInfo.estado === 1">{{ this.host }} - Partida: {{this.code}}</span>
        </div>    
        <div id="maingame">
            
            <title-component v-bind:ganador="this.serverInfo.ganador" v-bind:host="this.host" v-bind:code="this.code" v-bind:serverInfo="serverInfo"></title-component>
            <div class="row">
                <div class="card col-12 col-md-7 justify-content-center align-self-start">
                    <lobby-component v-if="this.serverInfo.estado === 0" v-bind:id="this.getId()" v-bind:maxPlayers="this.serverInfo.maxPlayers" v-bind:players="players"></lobby-component>    
                    <image-info-component v-if="this.serverInfo.estado === 1" v-bind:image="this.serverInfo.imagen" v-bind:palabra="this.serverInfo.palabra"></image-info-component>
                    <player-info-component v-if="this.serverInfo.estado === 2" v-bind:id="this.getId()" v-bind:serverInfo="this.serverInfo" v-bind:players="players"></player-info-component>
                </div>
                <!--<div class="col-md-1"></div>-->
                <div class="card col-12 col-md-5" id="chat_container">
                    <div class="alert alert-primary align-bottom" role="alert" id="chat">
                        <p><i>{{this.descripcion}}</i></p>
                    </div>
                </div>
            </div>
            
            <div class="row justify-content-around">
                <div class=" col-10 col-md-4 align-self-start p-2 ">
                    <player-info-component v-bind:id="this.getId()" v-bind:serverInfo="this.serverInfo" v-bind:players="players" v-if="this.serverInfo.estado === 1"></player-info-component>
                </div>
                <form class="col-10 col-md-3 mt-2 p-2 align-self-start">
                    <div class="form-group">
                        <label for="name" >Chat de respuestas: </label>
                        <input type="text" class="form-control" placeholder="Introduce texto" aria-label="mensaje"
                            id="mensaje" name="mensaje" maxlength="150">
                    </div>
                    <button type="submit" v-on:click.prevent="enviarTexto()" class="btn btn-primary mt-2"><i class="far fa-paper-plane"></i> &nbsp; Enviar</button>
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
        //console.log("ID!!!! " + id);
        //console.log("this.serverInfo.estado!!!! " + this.serverInfo.estado);
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
            this.borrarInterval();
            this.connected = false;
            this.$emit("end", {});
        },
        enviarTexto() {
            let mensaje = document.getElementById("mensaje").value;
            let nombre = this.name;
            let codigoPartida = this.code;
            let acierto = false;
            let puntos = 0;
            let id = this.getId();
            if (mensaje !== "" && mensaje !== null) {
                let idmsg = this.idmsg;
                document.getElementById("mensaje").value = "";
                this.socket.emit('mensaje', { id, idmsg, codigoPartida, nombre, mensaje, acierto, puntos });
                this.idmsg++;
            }
        },
        siguiente() {
            this.emitir('siguiente');
        },
        crearInterval() {
            if (this.serverInfo.finRonda === false && this.intervalID === null) {
                this.intervalID = setInterval(
                    (function (self) {
                        return function () {
                            self.decreaseTime();
                        }
                    })(this), 1000
                );
            }
        },
        borrarInterval() {
            if (this.intervalID != null) {
                clearInterval(this.intervalID);
                this.intervalID = null;
            }
        },
        decreaseTime() {
            if (this.serverInfo.tiempo > 0) {
                this.$emit("decreaseTime", {});
            } else {
                this.borrarInterval();
            }
        },
        getPlayers() {
            this.socket.on("listPlayers", (p) => {
                console.log("listPlayers ")
                console.log(p)
                this.players = [];
                for (let i = 0; i < p.listPlayers.length; i++) {
                    let id = p.listIds[i];
                    let nombre = p.listPlayers[i];
                    let siguiente = p.listSiguiente[i];
                    let acierto = p.listAcierto[i];
                    let puntos = p.listPuntos[i];

                    this.players.push({ id, nombre, siguiente, acierto, puntos });
                }
            });
        },
        getServerInfo() {
            this.socket.on("serverInfo", (data) => {
                console.log('serverInfo' + data.palabra)
                this.$emit("setServerInfo", data);
                this.crearInterval();

            });
        },
        emitir(str) {
            let codigoPartida = this.code;
            let tipoUsuario = this.mode;
            let nombre = this.name;
            let id = this.getId();
            let estado = this.serverInfo.estado;
            let endGameMethod = true;
            this.socket.emit(str, { id, codigoPartida, nombre, tipoUsuario, endGameMethod, estado });
        },

        getId() {
            return this.socketid || this.socket.id;
        }
    }
});

export default playGameComponent;