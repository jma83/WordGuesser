


export default class Conexion{
    socket = '';
    code = '';
    id=0;
    constructor(){
        this.initConection();

    }

   
    setCode(code){
        if (this.code===undefined || this.code==='')
        this.code = code;
    }

    setId(){
        this.id = this.socket.id;
    }


    
    initConection(code = ''){
        let self = this;
        return new Promise(function (resolve, reject) {
            self.socket = io();
            self.code = code;
            self.socket.emit('conexion');
            resolve();
        });
    }
}

