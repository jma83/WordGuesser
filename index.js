const path = require('path');
const express = require("express");
const app = express();


//settings
app.set('port', process.env.PORT || 4000);

console.log(path.join(__dirname,"public"))
app.use(express.static(path.join(__dirname,"public")))

const server = app.listen(app.get('port'), () =>{
    console.log('Server on port ' + app.get('port'));
})


//websockets

const SocketIO = require('socket.io');

const io = SocketIO(server);


io.on('connection', (socket) => {
    //console.log("conexion!", socket.id)

    socket.on("conexion", () => {
        //io.sockets.emit('mensajito',data)
        io.sockets.emit('id_conexion',socket.id);
    });

    socket.on("conexion_sala", data => {
        console.log(data);
        //io.sockets.emit('mensajito',data)
        io.sockets.emit('conexion_sala',data);
    });
    
    socket.on("mensaje", data => {
        io.sockets.emit('mensaje_chat',data)
    });

    socket.on("desconexion_sala", data => {
        socket.broadcast.emit('desconexion_sala',data)
    });

});