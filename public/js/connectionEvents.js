import ConnectionEvents from './connectionClass.js';

const chatStr = "chat";



let event = new ConnectionEvents();
event.startConnection();


event.connection.socket.on("mensaje_chat", (data) => {
    let chat = document.getElementById(chatStr);
    if (chat !== null)
        chat.innerHTML += "<p><b>" + data.nombre + ":</b> " + data.palabra + "</p>";
});

event.connection.socket.on("conexion_sala", (data) => {
    let chat = document.getElementById(chatStr);
    if (chat !== null)
        chat.innerHTML += "<p><i> - <b>" + data.nombre + " " + data.id + "</b> se ha unido a la partida!</i></p>";
});

event.connection.socket.on("desconexion_sala", (data) => {
    let chat = document.getElementById(chatStr);
    if (chat !== null)
        chat.innerHTML += "<p><i> - <b>" + data.nombre + " " + data.id + "</b> se ha desconectado de la partida!</i></p>";
});

event.connection.socket.on("conexion",  (data) => {
    console.log(event.connection.code);
    let code = data.substr(0, 5);
    console.log(code);

    event.connection.setCode(code);
    event.connection.setId();

});

event.connection.socket.on("sala_no_valida",  () => {

    event.connection.setInvalid(true);

});

window.addEventListener('beforeunload', (event) => { 
    let modo = sessionStorage.getItem("partida_modo");
    let nombre = sessionStorage.getItem("partida_nombre");
    let codigoPartida = sessionStorage.getItem("partida_codigo");
    let tipoUsuario = -1;
    //let id = event.connection.socket.id;
    
    if (Number(modo) === 0) {
        tipoUsuario = "Invitado";
    } else if (Number(modo) === 1) {
        tipoUsuario = "Anfitrión";
    }

    if (nombre!== null && nombre!==undefined)
    event.connection.socket.emit('desconexion_sala', {id, codigoPartida, nombre, tipoUsuario });

})

export default event;