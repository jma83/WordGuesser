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

let listaPartidas = [];

io.on('connection', (socket) => {
    //console.log("conexion!", socket.id)

    socket.on("conexion", () => {
        //io.sockets.emit('mensajito',data)
        io.sockets.emit('conexion',socket.id);
    });

    socket.on("conexion_sala", data => {
        console.log(data);
        //io.sockets.emit('mensajito',data)
        socket.join(data.codigoPartida);
        let check = listaPartidas.includes(data.codigoPartida);

        if (!check && Number(data.tipoUsuario) === 1)
        listaPartidas.push(data.codigoPartida);

        if(!check && Number(data.tipoUsuario) === 1 || check && Number(data.tipoUsuario) === 0){
            io.to(data.codigoPartida).emit('conexion_sala',data);
        }else{
            io.to(data.id).emit('sala_no_valida',data); 
            
        }
        console.log(listaPartidas)
    });
    
    socket.on("mensaje", data => {
        let check = listaPartidas.includes(data.codigoPartida);
        console.log("codigoPartida " + data.codigoPartida)
        console.log("check " + check)
        if(check){
            console.log("EMITIDO! " + data.palabra);
            io.to(data.codigoPartida).emit('mensaje_chat',data);
        }
    }); 

    socket.on("desconexion_sala", data => {
        let index = listaPartidas.indexOf(data.codigoPartida);
        if (index!==-1 && Number(data.tipoUsuario)===1){
            listaPartidas.splice(index, 1);
            socket.to(data.codigoPartida).emit('desconexion_sala',data);
        }
    });
    

});