const Player = require('./player')

module.exports = class Room {
    constructor(data) {
        if (data.codigoPartida != null && data.codigoPartida.length > 0) {
            this.codigo = data.codigoPartida;
            this.estado = 0;
            this.ronda = 0;
            this.imagen = '';
            this.palabra = '';
            this.finRonda = false;
            this.fin = false;
            this.players = [];
            //this.crearJugadorSala(data);
        }

    }

    crearJugadorSala(data) {
        if (!this.comprobarJugador(data.id)) {
            this.players.push(new Player(data));
        }
    }

    comprobarJugador(p) {
        let index = this.getIndexJugador(p);
        if (index !== -1) {
            if (this.players[index].room === this.codigo)
                return true;
        }
        return false;
    }

    siguienteJugador(p){
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

    getNombreJugadores(){
        let nombres = [];
        this.players.forEach(element => {
           nombres.push(element.nombre);
        });
        return nombres;
    }

    getSiguienteJugadores(){
        let siguientes = [];
        this.players.forEach(element => {
            siguientes.push(element.siguiente);
        });
        return siguientes;
    }

    getJugadores(){
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
            for(let i = 0;i<this.players.length;i++){
                if (this.players[i].id === id)
                return i;
            }
        }
        return -1;
    }

    setEstado(new_estado) {
        this.estado = new_estado;
    }

    setRonda(new_ronda) {
        this.ronda = new_ronda;
    }

    
}