import './playerInfoComponent.js';
import './imageInfoComponent.js';
import './titleComponent.js';
import './chatFormComponent.js';
import './chatLogComponent.js';
import '../settings/ventanaComponent.js';
import '../settings/verAjustesComponent.js';
import * as ConsClass from '../../../constants.js'
import Utils from '../../../utils.js'

let playGameComponent = Vue.component("play-game-component", {
    props: ["mode", "code", "socketid", "serverInfo", "players","mensajesChat"],
    data: function () {
        return {
            host: '',
            connected: false,
            modalWindow: null,
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
                    <player-info-component v-if="this.serverInfo.estado !== 1" v-bind:id="this.socketid" v-bind:serverInfo="this.serverInfo" v-bind:players="players"></player-info-component>
                    <image-info-component v-if="this.serverInfo.estado === 1" v-bind:image="this.serverInfo.imagen" v-bind:palabra="this.serverInfo.palabra"></image-info-component>
                </div>
                <div class="card col-12 col-md-5" id="chat_container">
                    <chat-log-component v-bind:mensajesChat="mensajesChat"/>
                </div>
            </div>
            
            <div class="row justify-content-around">
                <div class=" col-10 col-md-4 align-self-start p-2 ">
                    <player-info-component v-if="this.serverInfo.estado === 1" v-bind:id="this.socketid" v-bind:serverInfo="this.serverInfo" v-bind:players="players"></player-info-component>
                    <ver-ajustes-component v-if="this.serverInfo.estado !== 1" v-bind:serverInfo="this.serverInfo"></ver-ajustes-component>
                </div>
                <div class="col-10 col-md-3 mt-2 p-2 align-self-start">
                    <chat-form-component v-on:enviarTexto="enviarTexto"/>
                </div>
            </div>
            <div class="row justify-content-end">
                <button data-mdb-toggle="modal" data-mdb-target="#myModal" v-if="Number(this.mode)===1 && this.serverInfo.estado !== 1" type="input" v-on:click.prevent="ajustes(); " class="btn btn-primary col-4 col-md-3 col-lg-2 mr-2 align-self-end" id="ajustes" name="ajustes" data-dif="2"><i class="fas fa-cog"></i> &nbsp;Ajustes de partida</button>
                <button v-if="this.serverInfo.estado === 0 || this.serverInfo.finRonda===true" type="input" v-on:click.prevent="siguiente()" class="btn btn-info col-4 col-md-3 col-lg-2 mr-2 " id="siguiente" name="siguiente" data-dif="2"><i class="fas fa-check-circle"></i> &nbsp; Siguiente</button>
            </div>
        </div>       
        <ventana-component v-on:ajustes="ajustes" v-on:modificarAjustesSala="modificarAjustesSala" v-bind:serverInfo="this.serverInfo"></ventana-component> 
  </div>`,
    mounted() {
        if (Number(this.mode) === 0) {
            this.host = "Invitado";
        } else if (Number(this.mode) === 1) {
            this.host = "Anfitrión";
        }
        this.modalWindow = new mdb.Modal(document.getElementById(ConsClass.MODAL_WIN_ELEMENT));


    },
    updated() {
        if (Utils.checkValid(this.socketid) && Utils.checkValid(this.code) && this.connected === false ) {
            this.connected = true;
            this.$emit('connectRoom');
        }
    },
    methods: {
        ajustes() {
            this.modalWindow.toggle();
        },

        endGameEvent() {
            this.connected = false;
            this.$emit("end", {});
        },
        enviarTexto(texto) {
            if (Utils.checkValid(texto))
            this.$emit('enviarTexto',texto);
        },
        siguiente() {
            this.$emit('siguiente');
        },
        modificarAjustesSala(data) {
            this.ajustes();
            if (data != null) 
                this.$emit('modificarAjustesSala',data);
            
        },
    }
});

export default playGameComponent;