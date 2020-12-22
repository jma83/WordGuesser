import Conexion from './connectionClass.js';

let connection = new Conexion();
const chatStr = "chat";


connection.socket.on("mensaje_chat", (data) => {
    let chat = document.getElementById(chatStr);
    if (chat !== null)
        chat.innerHTML += "<p><b>" + data.nombre + ":</b> " + data.palabra + "</p>";
});

connection.socket.on("conexion_sala", (data) => {
    let chat = document.getElementById(chatStr);
    if (chat !== null)
        chat.innerHTML += "<p><i> - <b>" + data.nombre + " " + data.id + "</b> se ha unido a la partida!</i></p>";
});

connection.socket.on("desconexion_sala", (data) => {
    let chat = document.getElementById(chatStr);
    if (chat !== null)
        chat.innerHTML += "<p><i> - <b>" + data.nombre + " " + data.id + "</b> se ha desconectado de la partida!</i></p>";
});

connection.socket.on("id_conexion", async (data) => {
    connection.setCode(data);
    connection.setId(connection.socket.id);

});

window.addEventListener('beforeunload', (event) => { 
    let modo = sessionStorage.getItem("partida_modo");
    let nombre = sessionStorage.getItem("partida_nombre");
    let codigoPartida = sessionStorage.getItem("partida_codigo");
    let tipoUsuario = -1;
    let id = connection.socket.id;
    
    if (Number(modo) === 0) {
        tipoUsuario = "Invitado";
    } else if (Number(modo) === 1) {
        tipoUsuario = "Anfitrión";
    }

    if (nombre!== null && nombre!==undefined)
    connection.socket.emit('desconexion_sala', {id, codigoPartida, nombre, tipoUsuario });

})

export default connection;