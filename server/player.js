module.exports = class Player{
    constructor(data){
        this.id = data.id;
        this.room = data.codigoPartida;

        this.nombre = data.nombre;
        this.siguiente = false;
    }

    setSiguiente(value){
        this.siguiente = value;
    }

    setNombre(value){
        this.nombre = value;
    }
}