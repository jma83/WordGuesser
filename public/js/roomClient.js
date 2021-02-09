
import * as ConsClass from './constants.js'

export default class RoomClient {

    constructor() {
        this.setDefaultValues();
        this.players = [];
        this.intervalID = null;
    }

    setDefaultValues() {
        let codigo = '';
        let estado = 0;
        let ronda = 0;
        let imagen = '';
        let palabra = '';
        let finRonda = false;
        let tiempo = 0;
        let fin = false;
        let dificultad = 0;
        let maxTiempo = 20;
        let tipo = 1;
        let maxRondas = 6;
        let maxPlayers = 4
        let ganador = null;

        this.data = {codigo,estado,ronda,imagen,palabra,finRonda,tiempo,fin,dificultad,maxTiempo,tipo,maxRondas,maxPlayers,ganador};
    }

    setValues(data) {
        let codigo = data.codigo;
        let estado = data.estado;
        let ronda = data.ronda;
        let imagen = data.imagen;
        let palabra = data.palabra;
        let finRonda = data.finRonda;
        let tiempo = data.tiempo;
        let fin = data.fin;
        let dificultad = data.dificultad;
        let maxTiempo = data.maxTiempo;
        let tipo = data.tipo;
        let maxRondas = data.maxRondas;
        let maxPlayers = data.maxPlayers;
        let ganador = data.ganador;
        this.data = {codigo,estado,ronda,imagen,palabra,finRonda,tiempo,fin,dificultad,maxTiempo,tipo,maxRondas,maxPlayers,ganador};
    }

    getData(){
        return this.data;
    }

    comprobarFinPartida(data,players,id) {
        if (data.fin && localStorage.getItem(ConsClass.LOCAL_NOMBRE) != null && (localStorage.getItem("codigo_partida") == null)) {
            localStorage.setItem(ConsClass.LOCAL_CODIGO, true);
            this.end = true;
            if (data.ganador.id === id) {
                let victorias = localStorage.getItem(ConsClass.LOCAL_VICTORIAS)
                if (victorias != null) {
                    victorias++;
                    localStorage.setItem(ConsClass.LOCAL_VICTORIAS, victorias);
                } else {
                    localStorage.setItem(ConsClass.LOCAL_VICTORIAS, 1);
                }
            }

            let partidas = localStorage.getItem(ConsClass.LOCAL_PARTIDAS);
            if (partidas != null) {
                partidas++;
                localStorage.setItem(ConsClass.LOCAL_PARTIDAS, partidas);
            } else {
                localStorage.setItem(ConsClass.LOCAL_PARTIDAS, 1);
            }

            let puntuacion = localStorage.getItem(ConsClass.LOCAL_PUNTUACION);
            let puntuacionActual = 0;
            for (let i = 0; i < players.length; i++) {
                if (players[i].id === id) {
                    puntuacionActual = players[i].puntos;
                }
            }

            if (puntuacion != null) {
                if (puntuacionActual > puntuacion) {
                    localStorage.setItem(ConsClass.LOCAL_PUNTUACION, puntuacionActual);
                }
            } else {
                localStorage.setItem(ConsClass.LOCAL_PUNTUACION, puntuacionActual);
            }
            var d = new Date();
            let date = d.toUTCString();

            if (date != null) {
                localStorage.setItem(ConsClass.LOCAL_FECHA, date);
            }

            //this.$emit("actualizarPerfil", {});
        } else {
            if (!data.fin && localStorage.getItem(ConsClass.LOCAL_CODIGO) !== null) {
                localStorage.removeItem(ConsClass.LOCAL_CODIGO);
            }
        }
    }

    crearInterval() {
        console.log("this.finRonda: "+this.data.finRonda)
        console.log("this.intervalID: "+this.intervalID)
        if (this.data.finRonda === false && this.intervalID === null) {
            this.intervalID = setInterval(
                (function (self) {
                    return function () {
                        self.decreaseTime();
                    }
                })(this), 1000
            );
        }
    }

    borrarInterval() {
        if (this.intervalID != null) {
            clearInterval(this.intervalID);
            this.intervalID = null;
        }
    }
    decreaseTime() {
        console.log("decrease! " + this.data.tiempo)
        if (this.data.tiempo > 0) {
            this.data.tiempo--;
        } else {
            this.borrarInterval();
        }
    }

  
}