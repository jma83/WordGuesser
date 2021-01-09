module.exports = class Player{
    constructor(data){
        this.id = data.id;
        this.room = data.codigoPartida;

        this.nombre = data.nombre;
        this.tipoUsuario = data.tipoUsuario;
        this.conectado = true;
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

    getTipoUsuario(){
        return this.tipoUsuario;
    }

    setConectado(b){
        console.log("setConectado " +b)
        this.conectado = b;
    }
}