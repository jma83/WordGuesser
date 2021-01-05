const Player = require('./player')
const APIManager = require('./APIManager')

module.exports = class Room {
    constructor(data) {
        if (data.codigoPartida != null && data.codigoPartida.length > 0) {
            this.codigo = data.codigoPartida;
            this.estado = 0;
            this.ronda = 0;
            this.finRonda = false;
            this.fin = false;
            this.players = [];
            this.maxRondas = 6;
            this.maxPlayers = 4;
            this.imagen = '';
            this.palabra = '';
            this.palabraFictia = [];
            this.apiManager = new APIManager();
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
            let ronda = self.ronda;
            let imagen = self.imagen;
            let palabra = self.palabraFictia;
            let finRonda = self.finRonda;
            let fin = self.fin;
            let maxRondas = self.maxRondas;
            let maxPlayers = self.maxPlayers;

            resolve({ codigo, estado, ronda, imagen, palabra, finRonda, fin, maxRondas, maxPlayers });
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

    gestionarRonda(estado, ronda) {
        let self = this;
        return new Promise(function (resolve, reject) {
            if (estado === 0) {
                self.empezarPartida().then(() => {
                    resolve();
                }).catch((e) => {
                    console.log("ERROR!" + e)
                    reject();
                });;
            }
            if (estado === 1) {
                if (ronda >= self.maxRondas) {
                    self.finalizarPartida();
                    resolve();
                } else {
                    self.siguienteRonda().then(resolve()).catch((e) => {
                        console.log("ERROR!" + e)
                        reject();
                    });;
                }
            }
        });
    }

    empezarPartida() {
        let self = this;
        return new Promise(function (resolve, reject) {
            self.setEstado(1);
            self.setRonda(1);
            self.finRonda = false;
            self.fin = false;
            if (self.palabra === '') {
                self.apiManager.getImage().then((data) => {
                    self.palabra = data.palabra;
                    self.initPalabraFicticia();
                    self.imagen = data.imagen;
                    resolve();
                }).catch((e) => {
                    console.log("ERROR!" + e)
                    reject();
                });
            } else {
                resolve();
            }
        });

    }

    siguienteRonda() {
        let self = this;
        return new Promise(function (resolve, reject) {

            let ronda = self.ronda + 1;
            self.setEstado(1);
            self.setRonda(ronda);
            self.finRonda = true;
            self.fin = false;
            if (self.palabra === '') {
                self.apiManager.getImage().then((data) => {
                    self.palabra = data.palabra
                    self.initPalabraFicticia();
                    self.imagen = data.imagen;
                    resolve();
                }).catch((e) => {
                    console.log("ERROR!" + e)
                    reject();
                });
            } else {
                resolve();
            }


        });
    }

    finalizarPartida() {
        this.setEstado(2);
        this.setRonda(0);
        this.finRonda = true;
        this.fin = true;
    }

    setEstado(new_estado) {
        this.estado = new_estado;
    }

    setRonda(new_ronda) {
        this.ronda = new_ronda;
    }

    initPalabraFicticia() {
        let array = Array.from(this.palabra);

        for (let i = 0; i < array.length; i++)
            this.palabraFictia.push("_");

        this.palabraFictia = this.palabraFictia.join("");
    }

    nextPalabraFicticia() {
        let index = this.encontrarLetraDistinta();
        let array = Array.from(this.palabra);
        let array2 = Array.from(this.palabraFictia);
        array2[index] = array[index];
        this.palabraFictia = array2.join("");
        console.log(this.palabraFictia);
        return index;
    }

    calcularRandom(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    }

    encontrarLetraDistinta() {
        let posicionRandom = -1;

        if (this.palabraFictia.includes("_")) {
            let exit = 0;
            do {
                posicionRandom = Math.floor(Math.random() * (this.palabra.length));
                exit++;
            } while (this.palabraFictia[posicionRandom] !== '_' && exit <= this.palabra.length * 2);

        }
        return posicionRandom;

    }

}