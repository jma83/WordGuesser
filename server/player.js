module.exports = class Player{
    constructor(data){
        this.id = data.id;
        this.room = data.codigoPartida;

        this.nombre = data.nombre;
        this.siguiente = false;
        this.puntos = 0;
    }

    setSiguiente(value){
        this.siguiente = value;
    }

    setNombre(value){
        this.nombre = value;
    }

    setPuntos(puntos){
        this.puntos = puntos;
    }
}