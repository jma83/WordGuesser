import RoomClient from './roomClient.js'
import * as ConsClass from '../constants.js'

export default class ConnectionEvents {

    constructor(connection) {

        this.roomClient = new RoomClient();
        this.idmsg = 0;
        this.mensajesChat = []
        this.connection = connection;
        this.socket = connection.socket;

        this.mensaje_chat();
        this.conexion_sala();
        this.desconexion_sala();
        this.conexion();
        this.sala_no_valida();
        this.beforeunload();
        this.updatePlayers();
        this.updateServerInfo();

        this.beforeunloadEvent = null;


    }
    crearMensaje(nombre, msg, flagServer){
        let p = document.createElement("p");
        let b = document.createElement("b");
        let i = document.createElement("i");
        let textUsu = document.createTextNode(nombre);
        let text = document.createTextNode(msg);
       
        b.appendChild(textUsu);
        if (flagServer){ 
            i.appendChild(b);
            p.appendChild(i);
        }else{
            p.appendChild(b);
        }   
        
        p.appendChild(text);
        return p;
        
    }

    mensaje_chat() {
        this.socket.on(ConsClass.MENSAJE_SOCKET, (data) => {
            if (!data.acierto) {
                //this.mensajesChat += "<p><b>" + data.nombre + ":</b> " +  + "</p>";
                this.mensajesChat.push({nombre:data.nombre, mensaje: data.mensaje, serverFlag: false});
            } else {
                this.mensajesChat.push({
                    nombre: data.nombre, 
                    mensaje: " acertó la respuesta! (+" + data.puntos + " puntos!)", 
                    serverFlag: true
                });
                //this.mensajesChat += "<p><i> - <b>" + data.nombre + "</b> acertó la respuesta! (+" + data.puntos + " puntos!)</i></p>";
            }
            
        });
    }
    conexion_sala() {
        this.socket.on(ConsClass.CON_SALA_SOCKET, (data, reenter) => {
            if (reenter == false || reenter == true && Number(data.tipoUsuario) === 1)
                this.mensajesChat.push({
                    nombre: data.nombre, 
                    mensaje: " se ha unido a la partida!", 
                    serverFlag: true
                });
            //this.mensajesChat += "<p><i> - <b>" + data.nombre + "</b> se ha unido a la partida!</i></p>";
        });
    }
    desconexion_sala() {
        this.socket.on(ConsClass.DESCON_SALA_SOCKET, (data) => {
            this.mensajesChat.push({
                nombre: data.nombre, 
                mensaje: " se ha desconectado de la partida!", 
                serverFlag: true
            });
            //this.mensajesChat += "<p><i> - <b>" + data.nombre + "</b> se ha desconectado de la partida!</i></p>";
        });
    }
    conexion() {
        this.socket.on(ConsClass.CONEXION_SOCKET, (data) => {
            let code = data.substr(0, 5);
            this.connection.setCode(code);

        });
    }

    updatePlayers() {
        this.socket.on(ConsClass.LPLAYERS_SOCKET, (p) => {
            console.log("updatePlayers")
            console.log(p);
            this.roomClient.updatePlayers(p);
        });
    }
    updateServerInfo() {
        this.socket.on(ConsClass.SERVER_INFO_SOCKET, (data) => {
            this.roomClient.setValues(data);
            this.roomClient.crearInterval();
            this.roomClient.comprobarFinPartida(data,  this.getId());

        });
    }

    sala_no_valida() {
        this.socket.on(ConsClass.SALA_INV_SOCKET, () => {

            let game = document.getElementById(ConsClass.GAME_ELEMENT);
            let div1 = document.createElement("div");
            var classDiv = document.createAttribute("class");
            classDiv.value = "card mt-2";
            div1.setAttributeNode(classDiv);

            let div2 = document.createElement("div");
            var classDiv2 = document.createAttribute("class");
            classDiv2.value = "card-body ml-4";
            div2.setAttributeNode(classDiv2);

            let title = document.createElement("h4");
            let textTitle = document.createTextNode("Error! :(");
            title.appendChild(textTitle);

            let p = document.createElement("p");
            var classP = document.createAttribute("class");
            let textP = document.createTextNode("Partida no encontrada! Vuelve a intentarlo más tarde");
            p.appendChild(textP);
            classP.value = "card-text align-self-center justify-content-center";
            p.setAttributeNode(classP);



            div2.appendChild(title);
            div2.appendChild(p);
            div1.appendChild(div2);
            game.innerHTML = "";
            game.appendChild(div1);

        });
    }



    beforeunload() {
        window.addEventListener(ConsClass.BEFORE_UNLOAD, this.beforeunloadEvent = () => {
            let modo = this.currentMode;
            let nombre = this.currentName;
            let codigoPartida = this.connection.getCode().substr(0, 5);
            let endGameMethod = false;
            let id = this.connection.getId() || this.socket.id;

            if (nombre !== null && nombre !== undefined)
                this.socket.emit(ConsClass.DESCON_SALA_SOCKET, { id, codigoPartida, nombre, modo, endGameMethod });
        });
    }

    setCurrent(name, mode) {
        this.currentName = name;
        this.currentMode = mode;
    }
    connectRoom() {
        this.emitir(ConsClass.CON_SALA_SOCKET);

    }
    disconectRoom() {
        this.removeListeners();
        this.emitir(ConsClass.DESCON_SALA_SOCKET);
    }

    removeListeners() {

        this.socket.off(ConsClass.SERVER_INFO_SOCKET);
        this.socket.off(ConsClass.SALA_INV_SOCKET);
        this.socket.off(ConsClass.CONEXION_SOCKET);
        this.socket.off(ConsClass.DESCON_SALA_SOCKET);
        this.socket.off(ConsClass.CON_SALA_SOCKET);
        this.socket.off(ConsClass.MENSAJE_SOCKET);
        this.socket.off(ConsClass.LPLAYERS_SOCKET);
        window.removeEventListener(ConsClass.BEFORE_UNLOAD,this.beforeunloadEvent);
    }

    siguiente() {
        this.emitir(ConsClass.SIGUIENTE_EMIT);

    }

    

    enviarTexto(message) {
        let mensaje = message;
        let nombre = this.currentName;
        let codigoPartida = this.getCode();
        let acierto = false;
        let puntos = 0;
        let id = this.getId();
        let idmsg = this.idmsg;

        this.socket.emit(ConsClass.MENSAJE_ELEMENT, { id, idmsg, codigoPartida, nombre, mensaje, acierto, puntos });
        this.idmsg++;

    }

    modificarAjustesSala(data) {
        if (data != null) {
            let dificultad = data.dificultad;
            let maxTiempo = data.maxTiempo;
            let maxRondas = data.maxRondas;
            let maxPlayers = data.maxPlayers;
            let tipo = data.tipo;
            let codigoPartida = this.getCode();
            let id = this.getId();
            this.socket.emit(ConsClass.MOD_AJUSTES_EMIT, { id, codigoPartida, dificultad, maxTiempo, maxRondas, maxPlayers, tipo });

        }

    }


    emitir(str) {
        let codigoPartida = this.getCode();
        let tipoUsuario = this.currentMode;
        let nombre = this.currentName;
        let id = this.getId();
        let estado = this.roomClient.data.estado;
        let endGameMethod = true;
        let data = { id, codigoPartida, nombre, tipoUsuario, endGameMethod, estado };
        console.log(data);
        this.socket.emit(str, data);
    }

    getId() {
        return this.connection.getId() || this.socket.id;
    }

    getCode(){
        return this.connection.getCode().substr(0, 5);
    }

}