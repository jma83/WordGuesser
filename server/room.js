const Player = require('./player')
const Round = require('./Round')

module.exports = class Room {
    constructor(data) {
        if (data.codigoPartida != null && data.codigoPartida.length > 0) {
            this.codigo = data.codigoPartida;
            this.estado = 0;
            this.fin = false;
            this.maxRondas = 6;
            this.maxPlayers = 4;
            this.ronda = new Round();
            this.players = [];


            //this.crearJugadorSala(data);
        }

    }

    crearJugadorSala(data) {
        if (!this.comprobarJugador(data.id)) {
            this.players.push(new Player(data));
        }
    }

    getInfoSala() {
        let self = this;
        return new Promise(function (resolve, reject) {
            let codigo = self.codigo;
            let estado = self.estado;
            let fin = self.fin;
            let maxRondas = self.maxRondas;
            let maxPlayers = self.maxPlayers;
            let ronda = self.ronda.getRonda();
            let imagen = self.ronda.getImagen();
            let palabra = self.ronda.getPalabraFicticia();
            let finRonda = self.ronda.getFinRonda();
            let tiempo = self.ronda.getTime();

            resolve({ codigo, estado, ronda, imagen, palabra, finRonda, tiempo, fin, maxRondas, maxPlayers });
        });
    }

    comprobarJugador(p) {
        let index = this.getIndexJugador(p);
        if (index !== -1) {
            if (this.players[index].room === this.codigo)
                return true;
        }
        return false;
    }

    siguienteJugador(p) {
        let index = this.getIndexJugador(p);

        if (index !== -1) {
            this.players[index].setSiguiente(true);
        }
    }

    setAllSiguienteOff() {
        for (let i = 0; i < this.players.length; i++) {
            this.players[i].setSiguiente(false);
        }

    }

    borrarJugadorSala(data) {
        if (this.comprobarJugador(data.id)) {
            let index = this.getIndexJugador(data.id);

            if (index !== -1) {
                console.log("antes de borrar player!");
                this.players.splice(index, 1);
                console.log("borro ok!" + data.nombre)
            }
        }
    }

    calcularTiempoMuestra() {
        return this.ronda.calcularTiempoMuestra();
    }

    getNombreJugadores() {
        let nombres = [];
        this.players.forEach(element => {
            nombres.push(element.nombre);
        });
        return nombres;
    }

    getIdJugadores() {
        let ids = [];
        this.players.forEach(element => {
            ids.push(element.id);
        });
        return ids;
    }

    getSiguienteJugadores() {
        let siguientes = [];
        this.players.forEach(element => {
            siguientes.push(element.siguiente);
        });
        return siguientes;
    }

    getJugadores() {
        return this.players;
    }


    getJugador(id) {
        if (id != null) {
            this.players.forEach(player => {
                if (player.id === id)
                    return player;
            });
        }
        return null;
    }

    getIndexJugador(id) {
        if (id != null) {
            for (let i = 0; i < this.players.length; i++) {
                if (this.players[i].id === id)
                    return i;
            }
        }
        return -1;
    }

    gestionarRonda() {
        let self = this;
        return new Promise(function (resolve, reject) {
            if (self.estado === 0) {
                self.ronda.siguienteRonda().then(() => {
                    self.setEstado(1);
                    self.setAllSiguienteOff();
                    resolve();
                }).catch((e) => {
                    console.log("ERROR!" + e)
                    reject();
                });;
            }
            if (self.estado === 1) {
                if (self.comprobarFinPartida()) {
                    console.log("fin partida?")
                    resolve();
                } else if (self.ronda.getFinRonda() && !self.getSiguienteJugadores().includes(false)) {
                    console.log("condicion ok!")
                    self.ronda.siguienteRonda().then(() => {
                        self.setAllSiguienteOff();
                        resolve();
                    }).catch((e) => {
                        console.log("ERROR!" + e)
                        reject();
                    });;
                }
                console.log("adios!")
                resolve();
            }
        });
    }

    comprobarFinPartida() {
        if (this.ronda.getRonda() >= this.maxRondas) {
            this.finalizarPartida();
            this.setAllSiguienteOff();
        }
    }

    finalizarPartida() {
        this.setEstado(2);
        this.ronda.setRonda(0);
        this.ronda.setFinRonda(true);
        this.setFin(true);
    }

    setEstado(new_estado) {
        this.estado = new_estado;
    }

    setFin(fin) {
        this.fin = fin;
    }

    nextPalabraFicticia() {
        return this.ronda.nextPalabraFicticia();

    }




}