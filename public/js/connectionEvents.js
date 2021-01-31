import RoomClient from './roomClient.js'

export default class ConnectionEvents {



    constructor(connection) {
        console.log(connection)
        console.log("partida_sesion:" + sessionStorage.getItem("partida_sesion"))
        this.chatStr = "chat";
        this.gameStr = "maingame";
        this.roomClient = new RoomClient();
        this.idmsg = 0;
        this.players = [];
        
        this.connection = connection;
        this.socket = connection.socket;
        //if (sessionStorage.getItem("partida_sesion") === null) {
            console.log("partida sesion!")
            
            this.mensaje_chat();
            this.conexion_sala();
            this.desconexion_sala();
            this.conexion();
            this.sala_no_valida();
            this.beforeunload();
            this.updatePlayers();
            this.updateServerInfo();


            sessionStorage.setItem("partida_sesion", true);

    }

    mensaje_chat() {
        this.socket.on("mensaje_chat",  (data) => {
            let chat = document.getElementById(this.chatStr);
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
        this.socket.on("conexion_sala",  (data, reenter) => {
            console.log("holaaaa")
            let chat = document.getElementById(this.chatStr);
            console.log(data.tipoUsuario)
            if (chat !== null && (reenter == false || reenter == true && Number(data.tipoUsuario) === 1))
                chat.innerHTML += "<p><i> - <b>" + data.nombre + " " + data.id + "</b> se ha unido a la partida!</i></p>";
        });
    }
    desconexion_sala() {
        this.socket.on("desconexion_sala",  (data) => {
            let chat = document.getElementById(this.chatStr);
            if (chat !== null)
                chat.innerHTML += "<p><i> - <b>" + data.nombre + " " + data.id + "</b> se ha desconectado de la partida!</i></p>";
        });
    }
    conexion() {
        this.socket.on("conexion",  (data) => {
            let code = data.substr(0, 5);
            this.connection.setCode(code);
            //this.connection.setId(this.socket.id);

        });
    }

    updatePlayers() {
        this.socket.on("listPlayers",  (p) => {
            console.log("listPlayers???? ")
            console.log(p)
            this.players = [];
            for (let i = 0; i < p.listPlayers.length; i++) {
                let id = p.listIds[i];
                let nombre = p.listPlayers[i];
                let siguiente = p.listSiguiente[i];
                let acierto = p.listAcierto[i];
                let puntos = p.listPuntos[i];

                console.log("nombre: " + nombre)
                this.players.push({ id, nombre, siguiente, acierto, puntos });
            }
        });
    }
    updateServerInfo() {
        this.socket.on("serverInfo", (data) => {
            console.log('serverInfo' + data.palabra);
            this.roomClient.setValues(data);
            this.roomClient.crearInterval();
            this.roomClient.comprobarFinPartida(data,this.players);

        });
    }

    sala_no_valida() {
        this.socket.on("sala_no_valida",  () => {

            console.log("sala no valida!!!")

            let game = document.getElementById(this.gameStr);
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
        window.addEventListener('beforeunload', () => {
            let modo = sessionStorage.getItem("partida_modo");
            let nombre = sessionStorage.getItem("partida_nombre");
            let codigoPartida = sessionStorage.getItem("partida_codigo");
            let endGameMethod = false;
            let id = this.connection.getId() || this.socket.id;

            if (nombre !== null && nombre !== undefined)
                this.socket.emit('desconexion_sala', { id, codigoPartida, nombre, modo, endGameMethod });
            sessionStorage.removeItem("partida_sesion");
        });
    }

    setCurrent(name, mode) {
        this.currentName = name;
        this.currentMode = mode;
    }
    connectRoom() {
        this.emitir('conexion_sala');

    }
    disconectRoom() {
        this.removeListeners();
        this.emitir('desconexion_sala');
    }

    removeListeners(){
        
        this.socket.off('serverInfo');
        this.socket.off('sala_no_valida');
        this.socket.off('conexion');
        this.socket.off('desconexion_sala');
        this.socket.off('conexion_sala');
        this.socket.off('mensaje_chat');
        this.socket.off('listPlayers');
    }

    siguiente() {
        this.emitir('siguiente');

    }

    enviarTexto() {
        let mensaje = document.getElementById("mensaje").value;
        let nombre = this.currentName;
        let codigoPartida = this.connection.getCode().substr(0, 5) || sessionStorage.getItem("partida_codigo");
        let acierto = false;
        let puntos = 0;
        let id = this.getId();
        if (mensaje !== "" && mensaje !== null) {
            let idmsg = this.idmsg;
            document.getElementById("mensaje").value = "";
            this.socket.emit('mensaje', { id, idmsg, codigoPartida, nombre, mensaje, acierto, puntos });
            this.idmsg++;
        }
        document.getElementById("mensaje").focus();

    }


    emitir(str) {
        console.log("emitir")
        let codigoPartida = this.connection.getCode().substr(0, 5) || sessionStorage.getItem("partida_codigo");
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

}