


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

    setId(){
        this.id = this.socket.id;
    }

    setInvalid(b){
        this.invalid = b;
    }

    initSocket(){
        this.socket = io();
    }
    
    initConection(code = ''){
        this.invalid = false;
        this.code = code;
        this.socket.emit('conexion');
    }
}

export default class ConnectionEvents{
    startConnection(){
        this.connection = new Conexion();
    }
    initConection(code=''){
        this.connection.initConection(code);
    }

    setCode(code){
        this.connection.setCode(code);
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