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

const io = SocketIO(server);

let listaPartidas = [];
let mapPlayers = new Map();
let listPlayers = [];
let listPlayerIds = [];
let listSiguiente = [];

io.on('connection', (socket) => {

    socket.on("conexion", () => {
        io.sockets.emit('conexion', socket.id);
    });

    socket.on("conexion_sala", data => {
        console.log(data);

        socket.join(data.codigoPartida);
        let check = listaPartidas.includes(data.codigoPartida);

        if (!check && Number(data.tipoUsuario) === 1) {
            inicializarJugadoresSala(data);
            listaPartidas.push(data.codigoPartida);
        }

        let reenter = false;
        reenter = comprobarJugador(data);

        if (!check && Number(data.tipoUsuario) === 1 || check && Number(data.tipoUsuario) === 0 || reenter) {
            if (!reenter)
            gestionJugadoresNuevos(check, data);

            console.log("conexion_sala")
            console.log(mapPlayers)
            io.to(data.codigoPartida).emit('conexion_sala', data);

            listPlayers = getNombres(data);
            listSiguiente = getSiguientes(data);
            io.to(data.codigoPartida).emit('listPlayers', {listPlayers,listSiguiente});
        } else {
            console.log("sala no valida!! " + data.id)
            io.to(data.id).emit('sala_no_valida', data);

        }
        console.log(listaPartidas)
    });

    socket.on("mensaje", data => {
        let check = listaPartidas.includes(data.codigoPartida);
        if (check) {
            io.to(data.codigoPartida).emit('mensaje_chat', data);
        }
    });

    socket.on("siguiente", data => {
        siguienteJugador(data);
        
        listPlayers = getNombres(data);
        listSiguiente = getSiguientes(data);
        io.to(data.codigoPartida).emit('listPlayers', {listPlayers,listSiguiente});
    });

    socket.on("desconexion_sala", data => {
        if (data.endGameMethod) {
            let index = listaPartidas.indexOf(data.codigoPartida);
            if (index !== -1 && Number(data.tipoUsuario) === 1) {
                listaPartidas.splice(index, 1);
                mapPlayers.delete(data.codigoPartida);
            }

            borrarJugadorSala(data);
            console.log("desconexion_sala")
            console.log(mapPlayers)

            listPlayers = getNombres(data);
            listSiguiente = getSiguientes(data);
            io.to(data.codigoPartida).emit('listPlayers', {listPlayers,listSiguiente});
            socket.to(data.codigoPartida).emit('desconexion_sala', data);
            
        }
    });


});

function inicializarJugadoresSala(data) {
    let nombres = [data.nombre];
    let ids = [data.id];
    let siguiente = [false];
    mapPlayers.set(data.codigoPartida, { ids, nombres, siguiente });
}

function comprobarJugador(data) {
    if (mapPlayers.get(data.codigoPartida)) {
        let ids = mapPlayers.get(data.codigoPartida).ids;

        let check = ids.includes(data.id);
        if (check) {
            return true;
        }
    }
    return false;
}

function siguienteJugador(data){
    if (mapPlayers.get(data.codigoPartida)) {
        let ids = mapPlayers.get(data.codigoPartida).ids;
        let siguiente = mapPlayers.get(data.codigoPartida).siguiente;
        let index = ids.indexOf(data.id);
        console.log(index  + "!!!")
        if (index !== -1) {
            siguiente[index] = true;
            
        }
    }
}

function borrarJugadorSala(data) {
    if (mapPlayers.get(data.codigoPartida) != null) {
        let ids = mapPlayers.get(data.codigoPartida).ids;
        let nombres = mapPlayers.get(data.codigoPartida).nombres;
        let siguiente = mapPlayers.get(data.codigoPartida).siguiente;

        let index = ids.indexOf(data.id);
        if (index !== -1) {
            console.log("antes de borrar!" + nombres)

            ids.splice(index, 1);
            nombres.splice(index, 1);
            siguiente.splice(siguiente, 1);
            console.log("borro ok!" + nombres)
        }
        mapPlayers.set(data.codigoPartida, { ids, nombres, siguiente });
    }
}

function getNombres(data){
    if (mapPlayers.get(data.codigoPartida) != null) {
        let nombres = mapPlayers.get(data.codigoPartida).nombres;
        return nombres;
    }
    return [];
}
function getSiguientes(data){
    if (mapPlayers.get(data.codigoPartida) != null) {
        let siguiente = mapPlayers.get(data.codigoPartida).siguiente;
        return siguiente;
    }
    return [];
}

function gestionJugadoresNuevos(check, data) {
    listPlayers = mapPlayers.get(data.codigoPartida).nombres;
    listPlayerIds = mapPlayers.get(data.codigoPartida).ids;
    let siguiente = mapPlayers.get(data.codigoPartida).siguiente;
    if (check) {
        listPlayers.push(data.nombre);
        listPlayerIds.push(data.id);
        listSiguiente.push(false);
    }
    let ids = listPlayerIds;
    let nombres = listPlayers;
    mapPlayers.set(data.codigoPartida, { ids, nombres, siguiente });
}