


export default class Conexion {
    socket = '';
    code = '';
    id = '';

    constructor() {
        this.startConnection();

    }
    startConnection() {
        console.log("startConnection")
        this.initSocket();
        this.initConection();
    }
    setCode(code, session = false) {
        if (this.code === undefined || this.code === '' || session) {
            this.code = code;
            console.log("codigo: " + code);
        }
    }

    setId(id, session = false) {
        if (this.id === undefined || this.id === '' || session) {
            this.id = id;
            console.log("id: " + id)
        }
    }

    initSocket() {
        this.socket = io();
    }

    initConection(code = '') {
        this.code = code;
        this.socket.emit('conexion');
    }

    getCode() {
        return this.code;
    }
    getId() {
        return this.id;
    }

    restartValues() {
        this.code = '';
        this.id = '';
    }
}