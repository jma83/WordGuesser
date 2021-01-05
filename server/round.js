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
        this.tiempoMax = 5;
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
        return new Promise(function (resolve, reject) {
            console.log("Siguiente ronda!");
            let ronda = self.getRonda() + 1;

            if (self.palabra === '' || self.getFinRonda()) {
                self.setRonda(ronda);

                self.setFinRonda(false);
                self.palabraFictia = [];

                self.apiManager.getImage().then((data) => {
                    self.setPalabra(data.palabra);
                    self.setImagen(data.imagen);
                    self.initPalabraFicticia();
                    self.crearInterval();
                    resolve();
                }).catch((e) => {
                    console.log("ERROR!" + e)
                    reject();
                });
            } else {
                resolve();
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

            this.setFinRonda(true);
            this.resolverPalabra();
            this.borrarInterval();
        }

        return index;
    }

    resolverPalabra(){
        this.palabraFictia = this.palabra;
    }

    calcularTiempoMuestra(){
        let porcentaje = this.porcentajeMostrar / 100;
        let numeroLetrasMostrar = porcentaje * this.palabra.length;

        let res = this.tiempoMax / numeroLetrasMostrar;

        res = Math.round(res);
        if (res===0)
            res = 1;
        return (res*1000);
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