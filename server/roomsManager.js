//aqui se controlan ciertos aspectos del juego desde el server
//desde llamar a la api para obtener las palabras segun la config
//como controlar los eventos de siguiente ronda o fin de partida

Room = require('./room')

module.exports = class RoomsManager {
    constructor() {
        this.rooms = [];
    }

    crearSala(data) {
        if (!this.comprobarSala(data.codigoPartida) && Number(data.tipoUsuario) === 1)
            this.rooms.push(new Room(data));
    }

    comprobarSala(sala) {
        if (this.getSala(sala) != null)
            return true;

        return false;
    }

    comprobarUnionSala(data, reenter) {
        if (!this.comprobarSala(data.codigoPartida) && Number(data.tipoUsuario) === 1 ||
            this.comprobarSala(data.codigoPartida) && Number(data.tipoUsuario) === 0 ||
            reenter) {
            return true;
        }
        return false;
    }

    borrarSala(data) {
        if (this.comprobarSala(data.codigoPartida) && Number(data.tipoUsuario) === 1) {
            let index = this.getIndexSala(data.codigoPartida);

            if (index !== -1) {
                console.log("antes de borrar sala!");
                this.rooms.splice(index, 1);
                console.log("borro ok!" + data.codigoPartida)
            }
        }
    }

    getSalas() {
        return this.rooms;
    }

    getCodigosSalas() {
        let codigos = [];
        for (let i = 0; i < this.rooms.length; i++) {
            codigos.push(this.rooms[i].codigo);
        }
        return codigos;
    }

    getSala(sala) {
        if (sala != null) {
            for (let i = 0; i < this.rooms.length; i++) {
                if (this.rooms[i].codigo === sala)
                    return this.rooms[i];
            }
        }
        return null;
    }

    getIndexSala(sala) {
        if (sala != null) {
            for (let i = 0; i < this.rooms.length; i++) {
                if (this.rooms[i].codigo === sala)
                    return i;
            }
        }
        return -1;
    }
}
