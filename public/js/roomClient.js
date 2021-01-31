


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
        console.log("setValues! " + data.finRonda);
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

    comprobarFinPartida(data,players) {
        if (data.fin && localStorage.getItem("nombre") != null && (localStorage.getItem("codigo_partida") == null)) {
            localStorage.setItem("codigo_partida", true);
            this.end = true;
            if (data.ganador.id === this.getId()) {
                let victorias = localStorage.getItem("victorias")
                if (victorias != null) {
                    victorias++;
                    localStorage.setItem("victorias", victorias);
                } else {
                    localStorage.setItem("victorias", 1);
                }
            }

            let partidas = localStorage.getItem("partidas");
            if (partidas != null) {
                partidas++;
                localStorage.setItem("partidas", partidas);
            } else {
                localStorage.setItem("partidas", 1);
            }

            let puntuacion = localStorage.getItem("puntuacion");
            let puntuacionActual = 0;
            for (let i = 0; i < players.length; i++) {
                if (players[i].id === this.getId()) {
                    puntuacionActual = players[i].puntos;
                }
            }

            if (puntuacion != null) {
                if (puntuacionActual > puntuacion) {
                    localStorage.setItem("puntuacion", puntuacionActual);
                }
            } else {
                localStorage.setItem("puntuacion", puntuacionActual);
            }
            var d = new Date();
            let date = d.toUTCString();

            if (date != null) {
                localStorage.setItem("fecha", date);
            }

            //this.$emit("actualizarPerfil", {});
        } else {
            if (!data.fin && localStorage.getItem("codigo_partida") !== null) {
                localStorage.removeItem("codigo_partida");
            }
        }
    }

    crearInterval() {
        if (this.finRonda === false && this.intervalID === null) {
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
        if (this.tiempo > 0) {
            this.tiempo--;
        } else {
            this.borrarInterval();
        }
    }

  
}