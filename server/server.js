const RoomsManager = require('./game/roomsManager');
const ConsClass = require('./constants');


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

            if (!reenter){
                if (!sala.crearJugadorSala(data)){
                    this.io.to(data.id).emit(ConsClass.SALA_INV_SOCKET, data);
                    return -1;
                }
            }

            sala.conexionAnfitrion(data.id);
            console.log(ConsClass.CON_SALA_EMIT + " " + data.codigoPartida);
            console.log("id " + data.id);
            socket.join(data.codigoPartida);

            this.io.to(data.codigoPartida).emit(ConsClass.CON_SALA_EMIT, data, reenter);

            try {
                this.emitirListPlayer(sala, data);
                this.enviarInfoSala(sala, data)
            } catch (e) {
                console.log("ERROR! " + e);
            }

        } else {
            console.log(ConsClass.SALA_INV_SOCKET + " " + data.id)
            this.io.to(data.id).emit(ConsClass.SALA_INV_SOCKET, data);
        }
        console.log("Salas!!! conec " + this.roomsManager.getCodigosSalas())

    }

    desconexion_sala(data, socket) {
        let sala = this.roomsManager.getSala(data.codigoPartida);


        if (sala != null) {
            if (data.endGameMethod) {
                sala.borrarJugadorSala(data.id, true);

                if (this.roomsManager.borrarSala(data)) {
                    this.borrarInterval(data);
                }
            } else {
                console.log("Comprobar anfitrion - borrado sala " + data.id)
                sala.avisoAnfitrion(data.id);
                this.roomsManager.avisoBorrarSala(sala);
            }
            sala.borrarJugadorSala(data.id);
            console.log(ConsClass.DESCON_SALA_EMIT)
            this.emitirListPlayer(sala, data);
            socket.to(data.codigoPartida).emit(ConsClass.DESCON_SALA_EMIT, data);
        }



        console.log("Salas!!! desc " + this.roomsManager.getCodigosSalas())

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
            if (res.puntos !== -1 && res.puntos != null) {
                data.acierto = true;
                data.puntos = res.puntos;
                this.emitirListPlayer(sala, data);
                if (res.aciertoPlayers)
                    this.enviarInfoSala(sala, data);
            }
            this.io.to(data.codigoPartida).emit(ConsClass.MENSAJE_EMIT, data);
        }
    }

    emitirListPlayer(sala, data) {
        let dataPlayers = sala.getJugadoresInfo();
        console.log("EMITIR LIST PLAYER:");
        this.io.to(data.codigoPartida).emit(ConsClass.LPLAYERS_EMIT, dataPlayers);
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
                    self.io.to(data.codigoPartida).emit(ConsClass.SERVER_INFO_EMIT, res);
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

    actualizarPalabraRonda(data) {
        let sala = this.roomsManager.getSala(data.codigoPartida);

        if (sala != null) {
            let value = sala.nextPalabraFicticia();
            if (Number(value) === -1) {
                this.borrarInterval(data);
                this.emitirListPlayer(sala, data);
            }
            this.enviarInfoSala(sala, data);
        }
    }

    async enviarInfoSala(sala,data) {

        try {
            let res = await sala.getInfoSala();
            console.log(data.codigoPartida);
            this.io.to(data.codigoPartida).emit(ConsClass.SERVER_INFO_EMIT, res);
        } catch (e) {
            console.log("ERROR! " + e);
        }
    }

    async modificarAjustesSala(data) {
        let sala = this.roomsManager.getSala(data.codigoPartida);

        try {
            console.log(ConsClass.MOD_AJUSTES_SOCKET)
            let b = await sala.modificarAjustesSala(data);
            if (b) {
                this.enviarInfoSala(sala,data);
            }
        } catch (e) {
            console.log("ERROR! " + e);
        }
    }



}