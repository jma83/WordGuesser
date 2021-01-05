const RoomsManager = require('./roomsManager');


module.exports = class Server {
    //websockets

    constructor(io) {
        this.io = io;
        this.roomsManager = new RoomsManager();
        this.interval = 5000;
        this.intervalMap = new Map()

    }


    conexion_sala(data, socket) {
        console.log(data);
        let reenter = false;
        let sala = this.roomsManager.getSala(data.codigoPartida);
        if (sala != null)
            reenter = sala.comprobarJugador(data.id);

        if (this.roomsManager.comprobarUnionSala(data, reenter)) {
            this.roomsManager.crearSala(data);
            if (sala == null) sala = this.roomsManager.getSala(data.codigoPartida);

            if (!reenter)
                sala.crearJugadorSala(data);

            console.log("conexion_sala " + data.codigoPartida);
            console.log("id " + data.id);
            socket.join(data.codigoPartida);

            this.io.to(data.codigoPartida).emit('conexion_sala', data);

            this.emitirListPlayer(sala, data);
            sala.getInfoSala().then((res) => {
                console.log(res);
                this.io.to(data.codigoPartida).emit('serverInfo', res);
            });

        } else {
            console.log("sala no valida!! " + data.id)
            this.io.to(data.id).emit('sala_no_valida', data);
        }
        console.log("Salas!!! " + this.roomsManager.getCodigosSalas())

    }

    desconexion_sala(data, socket) {
        let sala = this.roomsManager.getSala(data.codigoPartida);
        if (data.endGameMethod && sala != null) {
            if (this.roomsManager.borrarSala(data)){
                this.borrarInterval(data);
            }

            sala.borrarJugadorSala(data);
            
            console.log("desconexion_sala")

            this.emitirListPlayer(sala, data);
            socket.to(data.codigoPartida).emit('desconexion_sala', data);

        }
        console.log("Salas!!! " + this.roomsManager.getCodigosSalas())

    }

    siguiente(data) {
        let sala = this.roomsManager.getSala(data.codigoPartida);
        if (sala != null) {
            sala.siguienteJugador(data.id);
            if (!sala.getSiguienteJugadores().includes(false)){
                this.cambiarEstadoServer(data);
            }
            this.emitirListPlayer(sala, data);
        }
    }

    mensaje(data) {
        let sala = this.roomsManager.getSala(data.codigoPartida);
        if (sala != null) {
            if (sala.comprobarPalabra(data.mensaje)){
                
            }
            this.io.to(data.codigoPartida).emit('mensaje_chat', data);
        }
    }

    emitirListPlayer(sala, data) {
        let listIds = sala.getIdJugadores();
        let listPlayers = sala.getNombreJugadores();
        let listSiguiente = sala.getSiguienteJugadores();
        console.log("EMITIR LIST PLAYER:");
        console.log(listPlayers);
        console.log(listSiguiente);
        this.io.to(data.codigoPartida).emit('listPlayers', { listIds, listPlayers, listSiguiente });
    }

    cambiarEstadoServer(data) {
        let sala = this.roomsManager.getSala(data.codigoPartida);
        if (sala != null) {
            console.log("cambio estado server")

            sala.gestionarRonda().then(() => {
                sala.getInfoSala().then((res) => {
                    this.interval = sala.calcularTiempoMuestra();
                    console.log("interval: " +  this.interval);

                    this.crearInterval(res, data);
                    this.io.to(data.codigoPartida).emit('serverInfo', res);
                });

            }).catch((e) => {
                console.log(e);
            });
        }
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
            let res = sala.nextPalabraFicticia();
            if (Number(res) === -1) {
                this.borrarInterval(data);
            }
            sala.getInfoSala().then((res) => {
                console.log(data.codigoPartida);
                this.io.to(data.codigoPartida).emit('serverInfo', res);

            });
        }
    }



}