
import * as ConsClass from '../constants.js'

export default class RoomClient {

    constructor() {
        this.setDefaultValues();
        this.players = [];
        this.intervalID = null;
        this.mensajesChat = []
        this.currentName = '';
        this.currentMode = -1;
    }

    setDefaultValues() {

        this.data = {
            codigo: '',
            estado: 0,
            ronda: 0,
            imagen: '',
            palabra: '',
            finRonda: false,
            tiempo: 0,
            fin: false,
            dificultad: 0,
            maxTiempo: 20,
            tipo: 1,
            maxRondas: 6,
            maxPlayers: 4,
            ganador: null
        };
    }

    setValues(data) {

        this.data = {
            codigo: data.codigo,
            estado: data.estado,
            ronda: data.ronda,
            imagen: data.imagen,
            palabra: data.palabra,
            finRonda: data.finRonda,
            tiempo: data.tiempo,
            fin: data.fin,
            dificultad: data.dificultad,
            maxTiempo: data.maxTiempo,
            tipo: data.tipo,
            maxRondas: data.maxRondas,
            maxPlayers: data.maxPlayers,
            ganador: data.ganador
        };
    }

    getData() {
        return this.data;
    }

    setCurrent(name, mode) {
        this.currentName = name;
        this.currentMode = mode;
    }

    comprobarFinPartida(data, id) {
        if (data.fin && localStorage.getItem(ConsClass.LOCAL_NOMBRE) != null && (localStorage.getItem(ConsClass.LOCAL_CODIGO) == null)) {
            localStorage.setItem(ConsClass.LOCAL_CODIGO, true);
            this.end = true;
            if (data.ganador.length === 1) {
                if (data.ganador[0].id === id) {
                    let victorias = localStorage.getItem(ConsClass.LOCAL_VICTORIAS)
                    if (victorias != null) {
                        victorias++;
                        localStorage.setItem(ConsClass.LOCAL_VICTORIAS, victorias);
                    } else {
                        localStorage.setItem(ConsClass.LOCAL_VICTORIAS, 1);
                    }
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
            for (let i = 0; i < this.players.length; i++) {
                if (this.players[i].id === id) {
                    puntuacionActual = this.players[i].puntos;
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
        if (this.data.tiempo > 0) {
            this.data.tiempo--;
        } else {
            this.borrarInterval();
        }
    }

    updatePlayers(newPlayers) {
        this.players = [];
        for (let i = 0; i < newPlayers.length; i++) {
            this.players.push({
                id: newPlayers[i].id,
                nombre: newPlayers[i].nombre,
                siguiente: newPlayers[i].siguiente,
                acierto: newPlayers[i].acierto,
                puntos: newPlayers[i].puntos
            });
        }
    }


}