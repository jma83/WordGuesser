const RoomsManager = require('./roomsManager');


module.exports = class Server {
    //websockets

    constructor(io) {
        this.io = io;
        this.roomsManager = new RoomsManager();

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
            this.roomsManager.borrarSala(data);

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

            this.emitirListPlayer(sala, data);
        }
    }

    mensaje(data) {
        let check = this.roomsManager.comprobarSala(data.codigoPartida);
        if (check) {
            this.io.to(data.codigoPartida).emit('mensaje_chat', data);
        }
    }

    emitirListPlayer(sala, data) {
        let listPlayers = sala.getNombreJugadores();
        let listSiguiente = sala.getSiguienteJugadores();
        this.io.to(data.codigoPartida).emit('listPlayers', { listPlayers, listSiguiente });
    }

    cambiarEstadoServer(data) {
        let sala = this.roomsManager.getSala(data.codigoPartida);
        if (sala != null) {
            console.log("cambio estado server")

            sala.gestionarRonda(data.estado, data.ronda).then(() => {
                sala.getInfoSala().then((res) => {
                    console.log(res);
                    this.io.to(data.codigoPartida).emit('serverInfo', res);
                });

            }).catch((e) => {
                console.log(e);
            });


        }

    }
}