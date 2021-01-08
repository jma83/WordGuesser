const path = require('path');
const express = require("express");
const app = express();


//settings
app.set('port', process.env.PORT || 4000);

app.use(express.static(path.join(__dirname, "public")))

const server = app.listen(app.get('port'), () => {
    console.log('Server on port ' + app.get('port'));
})


//websockets

const SocketIO = require('socket.io');
const Server = require('./server/server');


const io = SocketIO(server);

let game = new Server(io);


io.on('connection', (socket) => {

    socket.on("conexion", () => {
        console.log("conexion!")
        io.sockets.emit('conexion', socket.id);
        //io.to(socket.id).emit('conexion', socket.id);
    });

    socket.on("conexion_sala", data => {
        console.log("conexion_sala!")
        game.conexion_sala(data,socket);
    });
    
    socket.on("cambiarEstadoServer", data => {
        game.cambiarEstadoServer(data);
    });

    socket.on("mensaje", data => {
        game.mensaje(data);
    });

    socket.on("siguiente", data => {
        game.siguiente(data);
    });

    socket.on("desconexion_sala", data => {
        game.desconexion_sala(data,socket);
    });


});

