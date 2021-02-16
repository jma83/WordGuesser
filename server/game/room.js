const Player = require('./player')
const Round = require('./round')

module.exports = class Room {
    constructor(data) {
        if (data.codigoPartida != null && data.codigoPartida.length > 0) {
            this.codigo = data.codigoPartida;
            this.estado = 0;
            this.fin = false;
            this.maxRondas = 2;
            this.maxPlayers = 4;
            this.ronda = new Round();
            this.players = [];
            this.ganador = null;
        }

    }

    /* Metodo generico inicio */
    getInfoSala() {
        let self = this;
        return new Promise(async function (resolve, reject) {
            let codigo = self.codigo;
            let estado = self.estado;
            let fin = self.fin;

            let maxPlayers = self.maxPlayers;
            let dificultad = await self.ronda.getDificultad();
            let maxRondas = self.maxRondas;
            let maxTiempo = self.ronda.getMaxTiempo();
            let tipo = await self.ronda.getTipo();

            let ganador = self.getGanador();
            let ronda = self.ronda.getRonda();
            let imagen = self.ronda.getImagen();
            let palabra = self.ronda.getPalabraFicticia();
            let finRonda = self.ronda.getFinRonda();
            let tiempo = self.ronda.getTime();
            let res = { codigo, estado, ronda, imagen, palabra, finRonda, tiempo, fin, dificultad, maxTiempo, tipo, maxRondas, maxPlayers, ganador };
            resolve(res);
        });
    }


    /* Metodos gestión jugadores */
    crearJugadorSala(data) {
        if (!this.comprobarJugador(data.id) && this.players.length < this.maxPlayers) {
            this.players.push(new Player(data));
            return true;
        }
        return false;
    }

    comprobarJugador(p) {
        let index = this.getIndexJugador(p);
        if (index !== -1) {
            if (this.players[index].room === this.codigo) {
                return true;
            }
        }
        return false;
    }

    avisoAnfitrion(p) {
        let index = this.getIndexJugador(p);
        if (index !== -1 && Number(this.players[index].tipoUsuario) === 1) {
            this.players[index].setConectado(false);

        }
    }

    conexionAnfitrion(p) {
        let index = this.getIndexJugador(p);
        if (index < this.players.length && index >= 0) {
            if (index !== -1 && Number(this.players[index].tipoUsuario) === 1) {
                this.players[index].setConectado(true);

            }
        }
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
            this.players[i].setAcierto(false);
        }

    }

    borrarJugadorSala(id, anfitrion = false) {
        if (this.comprobarJugador(id)) {
            let index = this.getIndexJugador(id);

            if (index !== -1 && (anfitrion || !anfitrion && this.players[index].tipoUsuario === 0)) {
                this.players.splice(index, 1);
            }
        }
    }

    modificarAjustesSala(data) {
        let self = this;
        return new Promise(async function (resolve, reject) {

            self.maxPlayers = data.maxPlayers;
            self.maxRondas = data.maxRondas;
            let a = await self.ronda.setDificultad(data.dificultad);

            self.ronda.setMaxTiempo(data.maxTiempo);
            let b = await self.ronda.setTipo(data.tipo);
            if (a && b)
                resolve(true);
        });
    }



    getSiguienteJugadores() {
        let siguientes = [];
        for (let i = 0; i < this.players.length; i++)
            siguientes.push(this.players[i].siguiente);

        return siguientes;
    }

    getAciertoJugadores() {
        let aciertos = [];
        for (let i = 0; i < this.players.length; i++)
            aciertos.push(this.players[i].acierto);

        return aciertos;
    }

    resetPuntosJugadores() {
        for (let i = 0; i < this.players.length; i++)
            this.players[i].resetPuntos();;
    }

    getJugadores() {
        return this.players;
    }

    getJugadoresInfo() {
        let array = [];
        for (let i = 0; i < this.players.length; i++) {
            let id = this.players[i].id;
            let nombre = this.players[i].nombre;
            let siguiente = this.players[i].siguiente;
            let acierto = this.players[i].acierto;
            let puntos = this.players[i].puntos;
            array.push({id,nombre,siguiente,acierto,puntos});
        }
        return array;
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

    getGanador() {
        return this.ganador;
    }

    /* Metodos gestión ronda */
    calcularTiempoMuestra(ronda) {
        let self = this;
        return new Promise(function (resolve, reject) {
            resolve(self.ronda.calcularTiempoMuestra(ronda));

        });
    }

    gestionarRonda() {
        let self = this;
        return new Promise(async function (resolve, reject) {
            try {
                if (self.estado === 0) {
                    let b = await self.ronda.siguienteRonda();
                    if (b) {
                        self.setEstado(1);
                        self.setAllSiguienteOff();
                        resolve(true);
                    }

                }
                if (self.estado === 1) {
                    if (self.comprobarFinPartida()) {
                        self.setAllSiguienteOff();
                        resolve(true);
                    } else if (self.ronda.getFinRonda() && !self.getSiguienteJugadores().includes(false)) {
                        let b = await self.ronda.siguienteRonda();
                        if (b) {
                            self.setAllSiguienteOff();
                            resolve(true);
                        }
                    }
                }
                if (self.estado === 2 && !self.getSiguienteJugadores().includes(false)) {
                    self.reiniciarPartida();
                    let b = await self.ronda.siguienteRonda();
                    if (b) {
                        self.setAllSiguienteOff();
                        resolve(true);
                    }
                }
            } catch (e) {
                console.log("ERROR! " + e)
            }
        });
    }

    comprobarPalabra(data) {
        let puntos = this.ronda.comprobarPalabra(data.mensaje);
        let aciertoPlayers = false;
        if (puntos !== -1 && data.id !== '' && data.id != null) {
            let index = this.getIndexJugador(data.id);
            let player = this.players[index];
            if (player != null && player.getAcierto() === false) {
                player.setPuntosRonda(puntos);
                aciertoPlayers = !this.getAciertoJugadores().includes(false);
                if (aciertoPlayers)
                    this.ronda.finalizarRonda(true);

            } else {
                puntos = -1;
            }
        }

        return { puntos, aciertoPlayers };

    }

    comprobarFinPartida() {
        if (this.ronda.getRonda() >= this.maxRondas) {
            this.finalizarPartida();
            this.setAllSiguienteOff();
            return true;
        }
        return false;
    }

    reiniciarPartida() {
        this.setEstado(1);
        this.ronda.setRonda(0);
        this.ronda.setFinRonda(false);
        this.setFin(false);
        this.ganador = null;
        this.resetPuntosJugadores();
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
        this.comprobarGanador();
    }

    comprobarGanador() {
        let max = [];
        for (let i = 0; i < this.players.length; i++) {
            if (max.length===0){
                max.push(this.players[i]);
            }else if (this.players[i].puntos > max[0].puntos) {
                max = [];
                max.push(this.players[i]);
            }else if (this.players[i].puntos === max[0].puntos) {
                max.push(this.players[i]);
            }
        }
        this.ganador = max;
    }

    nextPalabraFicticia() {
        return this.ronda.nextPalabraFicticia();
    }

    getCodigo() {
        return this.codigo;
    }



}