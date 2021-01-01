const path = require('path');
const express = require("express");
const app = express();


//settings
app.set('port', process.env.PORT || 4000);

console.log(path.join(__dirname, "public"))
app.use(express.static(path.join(__dirname, "public")))

const server = app.listen(app.get('port'), () => {
    console.log('Server on port ' + app.get('port'));
})


//websockets

const SocketIO = require('socket.io');
const RoomsManager = require('./server/roomsManager.js');

const io = SocketIO(server);

let mapPartidas = new Map();
let listaPartidas = [];
let mapPlayers = new Map();
let listPlayers = [];
let listPlayerIds = [];
let listSiguiente = [];

let roomsManager = new RoomsManager();

io.on('connection', (socket) => {

    socket.on("conexion", () => {
        io.sockets.emit('conexion', socket.id);
    });

    socket.on("conexion_sala", data => {
        console.log(data);

        let reenter = false;
        let sala = roomsManager.getSala(data.codigoPartida);
        if (sala != null)
            reenter = sala.comprobarJugador(data.id);

        if (roomsManager.comprobarUnionSala(data, reenter)) {
            roomsManager.crearSala(data);
            if (sala == null) sala = roomsManager.getSala(data.codigoPartida);

            if (!reenter)
                sala.crearJugadorSala(data);

            console.log("conexion_sala")
            socket.join(data.codigoPartida);

            io.to(data.codigoPartida).emit('conexion_sala', data);

            listPlayers = sala.getNombreJugadores();
            listSiguiente = sala.getSiguienteJugadores();
            io.to(data.codigoPartida).emit('listPlayers', { listPlayers, listSiguiente });
            
        } else {
            console.log("sala no valida!! " + data.id)
            io.to(data.id).emit('sala_no_valida', data);
        }

        console.log("Salas!!! "+roomsManager.getCodigosSalas())
    });

    socket.on("mensaje", data => {
        let check = roomsManager.comprobarSala(data.codigoPartida);
        if (check) {
            io.to(data.codigoPartida).emit('mensaje_chat', data);
        }
    });

    socket.on("siguiente", data => {
        let sala = roomsManager.getSala(data.codigoPartida);
        if (sala != null) {
            sala.siguienteJugador(data.id);

            listPlayers = sala.getNombreJugadores();
            listSiguiente = sala.getSiguienteJugadores();
            io.to(data.codigoPartida).emit('listPlayers', { listPlayers, listSiguiente });
        }
    });

    socket.on("desconexion_sala", data => {
        let sala = roomsManager.getSala(data.codigoPartida);

        if (data.endGameMethod && sala != null) {
            roomsManager.borrarSala(data);

            console.log("desconexion_sala")

            listPlayers = sala.getNombreJugadores();
            listSiguiente = sala.getSiguienteJugadores();
            io.to(data.codigoPartida).emit('listPlayers', { listPlayers, listSiguiente });
            socket.to(data.codigoPartida).emit('desconexion_sala', data);

        }
        console.log("Salas!!! "+roomsManager.getCodigosSalas())
    });


});

