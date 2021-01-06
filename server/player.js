module.exports = class Player{
    constructor(data){
        this.id = data.id;
        this.room = data.codigoPartida;

        this.nombre = data.nombre;
        this.siguiente = false;
        this.puntos = 0;
        this.acierto = false;
    }

    setSiguiente(value){
        this.siguiente = value;
    }

    setNombre(value){
        this.nombre = value;
    }

    setPuntosRonda(puntos){
        this.puntos+= puntos;
        this.setAcierto(true);
    }

    setAcierto(b){
        this.acierto = b;
    }

    getAcierto(){
        return this.acierto;
    }

    getPuntos(){
        return this.puntos;
    }
}