


class Conexion{
    socket = '';
    code = '';
    id=0;
    invalid=false;

    constructor(){
        this.initSocket();
        this.initConection();

    }
    setCode(code){
        if (this.code===undefined || this.code==='')
        this.code = code;
    }

    setId(id){
        this.id = id;
        console.log("id: " + id)
    }

    setInvalid(b){
        this.invalid = b;
    }

    getInvalid(){
        return this.invalid;
    }

    initSocket(){
        this.socket = io();
    }
    
    initConection(code = ''){
        this.invalid = false;
        this.code = code;
        this.socket.emit('conexion');
    }
    setPlayers(list){
        
        this.players = list;
        if (this.players != null)
        this.players.sort();
    }

    getPlayers(){
        return this.players;
    }
}

export default class ConnectionEvents{
    players = [];

    startConnection(){
        this.connection = new Conexion();
    }
    initConection(code=''){
        this.connection.initConection(code);
    }

    setCode(code){
        this.connection.setCode(code);
    }

    setId(id){
        this.connection.setId(id);
    }

    getSocket(){
        return this.connection.socket;
    }

    getCode(){
        return this.connection.code;
    }

    getInvalid(){
        return this.connection.invalid;
    }

    getId(){
        return this.connection.id;
    }

    getConnection(){
        return this.connection;
    }
}