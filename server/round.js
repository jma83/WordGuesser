const APIManager = require('./APIManager')

module.exports = class Round {
    constructor() {
        this.ronda = 0;
        this.finRonda = false;
        this.imagen = '';
        this.palabra = '';
        this.palabraFictia = [];
        this.apiManager = new APIManager();
        this.tiempo = 0;
        this.intervalID = 0;
        this.tiempoMax = 30;
        this.porcentajeMostrar = 80;
    }

    initPalabraFicticia() {
        let array = Array.from(this.palabra);

        for (let i = 0; i < array.length; i++)
            this.palabraFictia.push("_");

        this.palabraFictia = this.palabraFictia.join("");
    }

    siguienteRonda() {
        let self = this;
        return new Promise(async function (resolve, reject) {
            let ronda = self.getRonda() + 1;

            if (self.palabra === '' || self.getFinRonda()) {
                self.setRonda(ronda);
                self.setFinRonda(false);
                self.palabraFictia = [];

                try {
                    let data = await self.apiManager.getImage();
                    self.setPalabra(data.palabra);
                    self.setImagen(data.imagen);
                    self.initPalabraFicticia();
                    self.crearInterval();
                    resolve(true);
                } catch (e) {
                    console.log("ERROR! " + e);
                }

            } else {
                resolve(false);
            }
        });
    }

    nextPalabraFicticia() {
        let index = -1;
        if (this.tiempo > 1) {
            index = this.encontrarLetraDistinta();
            let array = Array.from(this.palabra);
            let array2 = Array.from(this.palabraFictia);
            array2[index] = array[index];
            this.palabraFictia = array2.join("");
        }
        if (index === -1) {

            this.finalizarRonda(true);

        }

        return index;
    }

    resolverPalabra() {
        this.palabraFictia = this.palabra;
        this.palabra = '';
    }

    comprobarPalabra(mensaje) {
        if (mensaje.toLowerCase() === this.palabra.toLowerCase()) {
            return this.obtenerPuntuacion();
        }
        return -1;
    }

    obtenerPuntuacion() {
        return this.tiempo * 10;
    }

    calcularTiempoMuestra(r) {
        let res = 1;
        if (r === this.ronda) {
            let porcentaje = this.porcentajeMostrar / 100;
            let numeroLetrasMostrar = porcentaje * this.palabra.length;

            res = this.tiempoMax / numeroLetrasMostrar;

            res = Math.round(res);
            if (res < 1)
                res = 1;

        }
        return (res * 1000);

    }


    encontrarLetraDistinta() {
        let posicionRandom = -1;

        if (this.palabraFictia.includes("_")) {
            let exit = 0;
            do {
                posicionRandom = Math.floor(Math.random() * (this.palabra.length));
                exit++;
            } while (this.palabraFictia[posicionRandom] !== '_' && exit <= this.palabra.length * 2);

        }
        return posicionRandom;

    }

    crearInterval() {
        this.tiempo = this.tiempoMax;
        if (this.finRonda === false) {
            this.intervalID = setInterval(
                (function (self) {
                    return function () {
                        self.setTime();
                    }
                })(this), 1000
            );
        }
    }

    borrarInterval() {
        this.tiempo = 0;
        clearInterval(this.intervalID);
    }

    setTime() {
        if (this.tiempo > 0) {
            this.tiempo--;
        } else {
            this.borrarInterval();
        }
    }

    setRonda(new_ronda) {
        this.ronda = new_ronda;
    }

    setFinRonda(fin_ronda) {
        this.finRonda = fin_ronda;
    }

    finalizarRonda() {
        this.setFinRonda(true);
        this.resolverPalabra();
        this.borrarInterval();
    }

    setImagen(img) {
        this.imagen = img;
    }

    setPalabra(p) {
        this.palabra = p;
    }

    setPalabraFicticia(p) {
        this.palabraFictia = p;
    }

    getTime() {
        return this.tiempo;
    }

    getRonda() {
        return this.ronda;
    }

    getFinRonda() {
        return this.finRonda;
    }

    getImagen() {
        return this.imagen;
    }

    getPalabra() {
        return this.palabra;
    }

    getPalabraFicticia() {
        return this.palabraFictia;
    }

}