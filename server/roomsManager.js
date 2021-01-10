//aqui se controlan ciertos aspectos del juego desde el server
//desde llamar a la api para obtener las palabras segun la config
//como controlar los eventos de siguiente ronda o fin de partida

const Room = require('./room')

module.exports = class RoomsManager {
    constructor() {
        this.rooms = [];

    }

    crearSala(data) {
        if (!this.comprobarSala(data.codigoPartida) && Number(data.tipoUsuario) === 1) {
            this.rooms.push(new Room(data));
        }
    }

    comprobarSala(sala) {
        if (this.getSala(sala) != null)
            return true;

        return false;
    }

    avisoBorrarSala(sala) {
        console.log("avisoBorrarSala")
        setTimeout(() => { this.comprobarAnfitrionSala(sala) }, 5000);
    }

    comprobarPalabra(p) {
        if (this.palabra.toLowerCase() === p.toLowerCase()) {
            return true;
        }
        return false;
    }

    comprobarAnfitrionSala(sala) {
        let checkAnfi = false;
        let id = -1;
        if (this.comprobarSala(sala.getCodigo())) {
            let jugadores = sala.getJugadores();
            for (let j = 0; j < jugadores.length; j++) {
                if (Number(jugadores[j].getTipoUsuario()) === 1 && jugadores[j].conectado === true) {
                    checkAnfi = true;
                    id = jugadores[j].id;
                    break;
                }
            }
            if (!checkAnfi) {
                sala.borrarJugadorSala(id,true)

                console.log("borro sala!");
                this.borrarSala2(sala.getCodigo());

            }
        }
    }
    

    comprobarUnionSala(data, reenter) {
        console.log("comprobar!")
        console.log(data);
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
                return true;
            }
        }
        return false;
    }

    borrarSala2(codigo) {
        if (this.comprobarSala(codigo)) {
            let index = this.getIndexSala(codigo);

            if (index !== -1) {
                console.log("antes de borrar sala!");
                this.rooms.splice(index, 1);
                console.log("borro ok!" + codigo)
                return true;
            }
        }
        return false;
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
