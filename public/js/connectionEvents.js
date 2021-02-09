import RoomClient from './roomClient.js'
import * as ConsClass from './constants.js'

export default class ConnectionEvents {

    constructor(connection) {

        this.roomClient = new RoomClient();
        this.idmsg = 0;
        this.players = [];

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

    mensaje_chat() {
        this.socket.on(ConsClass.MENSAJE_SOCKET, (data) => {
            let chat = document.getElementById(ConsClass.CHAT_ELEMENT);
            if (chat !== null) {
                if (!data.acierto) {
                    chat.innerHTML += "<p><b>" + data.nombre + ":</b> " + data.mensaje + "</p>";
                } else {
                    chat.innerHTML += "<p><i> - <b>" + data.nombre + " " + data.id + "</b> acertó la respuesta! (+" + data.puntos + " puntos!)</i></p>";
                }
            }
        });
    }
    conexion_sala() {
        this.socket.on(ConsClass.CON_SALA_SOCKET, (data, reenter) => {
            let chat = document.getElementById(ConsClass.CHAT_ELEMENT);
            console.log(data.tipoUsuario)
            if (chat !== null && (reenter == false || reenter == true && Number(data.tipoUsuario) === 1))
                chat.innerHTML += "<p><i> - <b>" + data.nombre + " " + data.id + "</b> se ha unido a la partida!</i></p>";
        });
    }
    desconexion_sala() {
        this.socket.on(ConsClass.DESCON_SALA_SOCKET, (data) => {
            let chat = document.getElementById(ConsClass.CHAT_ELEMENT);
            if (chat !== null)
                chat.innerHTML += "<p><i> - <b>" + data.nombre + " " + data.id + "</b> se ha desconectado de la partida!</i></p>";
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
            this.players = [];
            for (let i = 0; i < p.listPlayers.length; i++) {
                let id = p.listIds[i];
                let nombre = p.listPlayers[i];
                let siguiente = p.listSiguiente[i];
                let acierto = p.listAcierto[i];
                let puntos = p.listPuntos[i];

                this.players.push({ id, nombre, siguiente, acierto, puntos });
            }
        });
    }
    updateServerInfo() {
        this.socket.on(ConsClass.SERVER_INFO_SOCKET, (data) => {
            this.roomClient.setValues(data);
            this.roomClient.crearInterval();
            this.roomClient.comprobarFinPartida(data, this.players, this.getId());

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

    

    enviarTexto() {
        let mensaje = document.getElementById(ConsClass.MENSAJE_ELEMENT).value;
        let nombre = this.currentName;
        let codigoPartida = this.getCode();
        let acierto = false;
        let puntos = 0;
        let id = this.getId();
        if (mensaje !== "" && mensaje !== null) {
            let idmsg = this.idmsg;
            document.getElementById(ConsClass.MENSAJE_ELEMENT).value = "";
            this.socket.emit(ConsClass.MENSAJE_ELEMENT, { id, idmsg, codigoPartida, nombre, mensaje, acierto, puntos });
            this.idmsg++;
        }
        document.getElementById(ConsClass.MENSAJE_ELEMENT).focus();

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