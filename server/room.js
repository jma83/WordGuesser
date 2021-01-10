const Player = require('./player')
const Round = require('./Round')

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

            console.log("tipo: " +  tipo)
            console.log("dificultad: " +  dificultad)

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
        console.log("avisoAnfitrion " + index + " ")
        console.log("id: " + p)
        let jugadores = this.getJugadores();
        console.log(jugadores);
        if (index !== -1 && Number(this.players[index].tipoUsuario) === 1) {
            this.players[index].setConectado(false);

        }
    }

    conexionAnfitrion(p) {
        let index = this.getIndexJugador(p);
        console.log("conexionAnfitrion " + index + " " + this.players[index].tipoUsuario)
        console.log("id: " + p)
        if (index !== -1 && Number(this.players[index].tipoUsuario) === 1) {
            this.players[index].setConectado(true);

        }
    }

    siguienteJugador(p) {
        let index = this.getIndexJugador(p);

        if (index !== -1) {
            this.players[index].setSiguiente(true);
        }
    }

    setAllSiguienteOff() {
        console.log("--setAllSiguienteOff")
        for (let i = 0; i < this.players.length; i++) {
            this.players[i].setSiguiente(false);
            this.players[i].setAcierto(false);
        }

    }

    borrarJugadorSala(id, anfitrion = false) {
        if (this.comprobarJugador(id)) {
            let index = this.getIndexJugador(id);

            if (index !== -1 && (anfitrion || !anfitrion && this.players[index].tipoUsuario === 0)) {
                console.log("antes de borrar player!");
                this.players.splice(index, 1);
            }
        }
    }

    modificarAjustesSala(data){
        let self = this;
        return new Promise(async function (resolve, reject) {

            self.maxPlayers=data.maxPlayers;
            self.maxRondas=data.maxRondas;
            let a = await self.ronda.setDificultad(data.dificultad);

             self.ronda.setMaxTiempo(data.maxTiempo);
            let b = await self.ronda.setTipo(data.tipo);
            if (a && b)
            resolve(true);
        });
    }

    getNombreJugadores() {
        let nombres = [];
        for (let i = 0; i < this.players.length; i++)
            nombres.push(this.players[i].nombre);

        return nombres;
    }

    getIdJugadores() {
        let ids = [];
        for (let i = 0; i < this.players.length; i++)
            ids.push(this.players[i].id);

        return ids;
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

    getPuntosJugadores() {
        let puntos = [];
        for (let i = 0; i < this.players.length; i++)
            puntos.push(this.players[i].puntos);

        return puntos;
    }

    getJugadores() {
        return this.players;
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
                    console.log("estado 0")
                    let b = await self.ronda.siguienteRonda();
                    if (b) {
                        self.setEstado(1);
                        self.setAllSiguienteOff();
                        resolve(true);
                    }

                }
                if (self.estado === 1) {
                    console.log("estado 1")
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
                    console.log("estado 2")
                    self.reiniciarPartida();
                    let b = await self.ronda.siguienteRonda();
                    if (b) {
                        self.setAllSiguienteOff();
                        resolve(true);
                    }
                    resolve(true);
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
                console.log("No estblece puntos jugador es null! " + player.getAcierto())
                puntos = -1;
            }
        }

        return { puntos, aciertoPlayers };

    }

    comprobarFinPartida() {
        console.log("comprobarFinPartida")
        if (this.ronda.getRonda() >= this.maxRondas) {
            this.finalizarPartida();
            this.setAllSiguienteOff();
            console.log("zzz")
            return true;
        }
        return false;
    }

    reiniciarPartida() {
        this.setEstado(1);
        this.ronda.setRonda(0);
        this.ronda.setFinRonda(false);
        this.setFin(false);
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
        let max = -1;
        for (let i = 0; i < this.players.length; i++) {
            if (max === -1 || this.players[i].puntos > max.puntos) {
                max = this.players[i];
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