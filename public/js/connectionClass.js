


export default class Conexion{
    socket = '';
    code = '';
    id=0;
    constructor(){
        this.initConection();

    }

   
    setCode(code){
        this.code = code;
    }

    setId(id){
        this.id = id;
    }


    
    initConection(){
        let self = this;
        return new Promise(function (resolve, reject) {
            self.socket = io();
            self.code = '';
            self.socket.emit('conexion');
            resolve();
        });
    }
}
