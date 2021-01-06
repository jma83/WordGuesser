const RoomsManager = require('./roomsManager');


module.exports = class Server {
    //websockets

    constructor(io) {
        this.io = io;
        this.roomsManager = new RoomsManager();
        this.interval = 5000;
        this.intervalMap = new Map()

    }


    async conexion_sala(data, socket) {
        console.log(data);
        let reenter = false;
        let sala = this.roomsManager.getSala(data.codigoPartida);
        if (sala != null)
            reenter = sala.comprobarJugador(data.id);

        if (this.roomsManager.comprobarUnionSala(data, reenter)) {
            this.roomsManager.crearSala(data);
            if (sala == null) sala = this.roomsManager.getSala(data.codigoPartida);

            if (!reenter)
                if (!sala.crearJugadorSala(data))
                this.io.to(data.id).emit('sala_no_valida', data);

            console.log("conexion_sala " + data.codigoPartida);
            console.log("id " + data.id);
            socket.join(data.codigoPartida);

            this.io.to(data.codigoPartida).emit('conexion_sala', data);

            try {
                this.emitirListPlayer(sala, data);
                let res = await sala.getInfoSala()
                console.log(res);
                this.io.to(data.codigoPartida).emit('serverInfo', res);
            } catch (e) {
                console.log("ERROR! " + e);
            }

        } else {
            console.log("sala no valida!! " + data.id)
            this.io.to(data.id).emit('sala_no_valida', data);
        }
        console.log("Salas!!! " + this.roomsManager.getCodigosSalas())

    }

    desconexion_sala(data, socket) {
        let sala = this.roomsManager.getSala(data.codigoPartida);
        if (data.endGameMethod && sala != null) {
            if (this.roomsManager.borrarSala(data)) {
                this.borrarInterval(data);
            }

            sala.borrarJugadorSala(data);

            console.log("desconexion_sala")

            this.emitirListPlayer(sala, data);
            socket.to(data.codigoPartida).emit('desconexion_sala', data);

        }
        console.log("Salas!!! " + this.roomsManager.getCodigosSalas())

    }

    async siguiente(data) {
        let sala = this.roomsManager.getSala(data.codigoPartida);
        if (sala != null) {
            sala.siguienteJugador(data.id);
            if (!sala.getSiguienteJugadores().includes(false)) {
                try {
                    let res = await this.cambiarEstadoServer(data);
                    if (res) {
                        console.log("-emitirListPlayer")
                        this.emitirListPlayer(sala, data);
                    }
                } catch (e) {
                    console.log("ERROR! " + e)
                }
            } else {
                console.log("-emitirListPlayer")
                this.emitirListPlayer(sala, data);
            }
        }
    }

    mensaje(data) {
        let sala = this.roomsManager.getSala(data.codigoPartida);
        if (sala != null) {
            let res = sala.comprobarPalabra(data);
            if (res !== -1 && res != null) {
                data.acierto = true;
                data.puntos = res;
                this.emitirListPlayer(sala, data);
            }
            this.io.to(data.codigoPartida).emit('mensaje_chat', data);
        }
    }

    emitirListPlayer(sala, data) {
        let listIds = sala.getIdJugadores();
        let listPlayers = sala.getNombreJugadores();
        let listSiguiente = sala.getSiguienteJugadores();
        let listAcierto = sala.getAciertoJugadores();
        let listPuntos = sala.getPuntosJugadores();
        console.log("EMITIR LIST PLAYER:");
        this.io.to(data.codigoPartida).emit('listPlayers', { listIds, listPlayers, listSiguiente, listAcierto, listPuntos });
    }

    cambiarEstadoServer(data) {
        let self = this;
        return new Promise(async function (resolve, reject) {
            let sala = self.roomsManager.getSala(data.codigoPartida);
            if (sala != null) {
                console.log("cambio estado server")
                try {
                    await sala.gestionarRonda();
                    let res = await sala.getInfoSala();
                    let interval = await sala.calcularTiempoMuestra(res.ronda);
                    self.interval = interval;
                    console.log("interval: " + self.interval);

                    self.crearInterval(res, data);
                    self.io.to(data.codigoPartida).emit('serverInfo', res);
                    resolve(true);

                } catch (e) {
                    console.log("ERROR! " + e);
                }
            }
        });
    }

    crearInterval(res, data) {

        if (res.estado === 1 && this.intervalMap.has(data.codigoPartida) === false) {
            let intervalID = setInterval(
                (function (self) {
                    return function () {
                        self.actualizarPalabraRonda(data);
                    }
                })(this),
                this.interval
            );
            this.intervalMap.set(data.codigoPartida, intervalID);
        }
    }

    borrarInterval(data) {
        let intervalID = this.intervalMap.get(data.codigoPartida);
        clearInterval(intervalID);
        this.intervalMap.delete(data.codigoPartida);
    }

    async actualizarPalabraRonda(data) {
        let sala = this.roomsManager.getSala(data.codigoPartida);

        if (sala != null) {
            let value = sala.nextPalabraFicticia();
            if (Number(value) === -1) {
                this.borrarInterval(data);
                this.emitirListPlayer(sala, data);
            }
            try {
                let res = await sala.getInfoSala();
                console.log(data.codigoPartida);
                this.io.to(data.codigoPartida).emit('serverInfo', res);
            } catch (e) {
                console.log("ERROR! " + e);
            }
        }
    }



}