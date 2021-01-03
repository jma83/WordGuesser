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
            this.apiManager = new APIManager();
            //this.crearJugadorSala(data);
        }

    }

    crearJugadorSala(data) {
        if (!this.comprobarJugador(data.id)) {
            this.players.push(new Player(data));
        }
    }

    getInfoSala(){
        let codigo = this.codigo;
        let estado = this.estado;
        let ronda = this.ronda;
        let imagen = this.apiManager.imagen;
        let palabra = this.apiManager.palabra;
        let finRonda = this.finRonda;
        let fin = this.fin;
        let maxRondas = this.maxRondas;
        let maxPlayers = this.maxPlayers;

        return {codigo,estado,ronda,imagen,palabra,finRonda,fin,maxRondas,maxPlayers};
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
        if (estado === 0)
            this.empezarPartida();
        if (estado === 1) {
            if (ronda >= this.maxRondas)
                this.finalizarPartida();
            else
                this.siguienteRonda();
        }
    }

    empezarPartida() {
        this.setEstado(1);
        this.setRonda(1);
        this.apiManager.getImage();
    }

    siguienteRonda() {
        let ronda = this.ronda + 1;
        this.setEstado(1);
        this.setRonda(ronda);
        this.finRonda = true;
        this.fin = false;
        this.apiManager.getImage();
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


}