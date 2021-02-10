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
const ConsClass = require('./server/constants');


const io = SocketIO(server);

let game = new Server(io);


io.on('connection', (socket) => {

    socket.on(ConsClass.CONEXION_SOCKET, () => {
        io.sockets.emit(ConsClass.CONEXION_SOCKET, socket.id);
        //io.to(socket.id).emit('conexion', socket.id);
    });

    socket.on(ConsClass.CON_SALA_EMIT, data => {
        game.conexion_sala(data,socket);
    });
    
    socket.on(ConsClass.MENSAJE_SOCKET, data => {
        game.mensaje(data);
    });

    socket.on(ConsClass.SIGUIENTE_SOCKET, data => {
        game.siguiente(data);
    });

    socket.on(ConsClass.MOD_AJUSTES_SOCKET, data => {
        game.modificarAjustesSala(data);
    });

    socket.on(ConsClass.DESCON_SALA_SOCKET, data => {
        game.desconexion_sala(data,socket);
    });


});

