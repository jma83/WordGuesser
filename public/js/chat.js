const socket = io();


socket.on("mensaje_chat", (data) => {
    document.getElementById("chat").innerHTML += "<p><b>" + data.nombre + ":</b> " + data.palabra + "</p>";
});

socket.on("conexion_sala", (data) => {
    document.getElementById("chat").innerHTML += "<p><i> - <b>" + data.nombre + "</b> se ha unido a la partida!</i></p>";
});