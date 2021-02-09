
import * as ConsClass from './constants.js'

export default class Conexion {
    socket = '';
    code = '';
    id = '';

    constructor() {
        this.startConnection();
    }
    startConnection() {
        this.initSocket();
        this.initConection();
    }
    setCode(code, session = false) {
        if (this.code === undefined || this.code === '' || session) {
            this.code = code;
        }
    }

    setId(id, session = false) {
        if (this.id === undefined || this.id === '' || session) {
            this.id = id;
        }
    }

    initSocket() {
        this.socket = io();
    }

    initConection(code = '') {
        this.code = code;
        this.socket.emit(ConsClass.CONEXION_EMIT);
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