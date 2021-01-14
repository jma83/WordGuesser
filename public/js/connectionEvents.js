
export default class ConnectionEvents {



    constructor(connection) {
        console.log(connection)
        console.log("partida_sesion:" + sessionStorage.getItem("partida_sesion") )
        if (sessionStorage.getItem("partida_sesion") === null) {

            this.connection = connection;
            this.socket = connection.socket;
            this.mensaje_chat();
            this.conexion_sala();
            this.desconexion_sala();
            this.conexion();
            this.sala_no_valida();
            this.beforeunload();
            this.chatStr = "chat";
            this.gameStr = "maingame";
            sessionStorage.setItem("partida_sesion", true);
        }

    }

    mensaje_chat() {
        this.socket.on("mensaje_chat", (data) => {
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
        this.socket.on("conexion_sala", (data, reenter) => {
            console.log("holaaaa")
            let chat = document.getElementById(this.chatStr);
            console.log(data.tipoUsuario)
            if (chat !== null && (reenter == false || reenter == true && Number(data.tipoUsuario) === 1))
                chat.innerHTML += "<p><i> - <b>" + data.nombre + " " + data.id + "</b> se ha unido a la partida!</i></p>";
        });
    }
    desconexion_sala() {
        this.socket.on("desconexion_sala", (data) => {
            let chat = document.getElementById(this.chatStr);
            if (chat !== null)
                chat.innerHTML += "<p><i> - <b>" + data.nombre + " " + data.id + "</b> se ha desconectado de la partida!</i></p>";
        });
    }
    conexion() {
        this.socket.on("conexion", (data) => {
            let code = data.substr(0, 5);
            this.connection.setCode(code);
            //this.connection.setId(this.socket.id);

        });
    }

    sala_no_valida() {
        this.socket.on("sala_no_valida", () => {

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

            /*if (Number(modo) === 0) {
                tipoUsuario = "Invitado";
            } else if (Number(modo) === 1) {
                tipoUsuario = "Anfitrión";
            }*/

            if (nombre !== null && nombre !== undefined)
                this.socket.emit('desconexion_sala', { id, codigoPartida, nombre, modo, endGameMethod });
            sessionStorage.removeItem("partida_sesion");
        });
    }
}