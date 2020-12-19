//selecciona y guarda una palabra de la lista, en base a lo indicado por gameManager (que tiene todos los settigns de usuario)
//compruba si los inputs de usuario coinciden con la palabra oculta
//le diche al gameManager si se ha acabado la partida (victoria o derrota)
export default class WordManager {
    constructor() {
        //crea un wordManager
        this.palabras = [];
        this.arrayLetrasVisibles = [];
        this.tamanyoPalabra = 0;
        this.palabraActual = "";
        this.letraOculta = "_";
    }

    checkGuessedWord() {
        return !this.arrayLetrasVisibles.includes("_", 0, this.arrayLetrasVisibles.length);
    }

    seleccionarPalabra() {  // Metodo que selecciona una palabra de la lista
        const a = Math.floor(Math.random() * (this.palabras.length));
        let palabra = this.palabras[a].word;
        console.log(palabra);
        let i = 0;
        for (i = 0; i < palabra.length; i++) {
            this.arrayLetrasVisibles.push(this.letraOculta);
        }
        this.tamanyoPalabra = i;
        this.palabras = [];
    }

    mostrarLetrasRandom(tam) {  // Metodo que muestra inicialmente el numero de letras especificado por parametro
        let newthis = this;
        let arrayLettrasRandom = [];
        let posicionRandom=-1;
        let arrayPosicionesOk=[];
        return new Promise(function (resolve, reject) {
            let cont = 0;
            let contaux = 0;
            let exit = 0;
            let letra = "";
            do {
                posicionRandom = Math.floor(Math.random() * (this.arrayLetrasVisibles.length));
                if (this.arrayLetrasVisibles.charAt(posicionRandom) === this.letraOculta){

                }
                exit++;
            } while (exit<=this.arrayLetrasVisibles.length*2);
            

            resolve();
        });
    }

    encontrarLetraDistinta(p) { // Metodo que busca una letra aleatoria dentro de la palabra que noo este ya en la lista recibida por parametro
        let posicionRandom = -1;
        let exit = 0;
        do {
            posicionRandom = Math.floor(Math.random() * (this.arrayLetrasVisibles.length));
            exit++;
        } while (p.includes(this.arrayObjLetras[posicionRandom].getLetter()) && exit<=this.arrayLetrasVisibles.length*2);

        return posicionRandom;
    }

    getWords() {    // Metodo que obtiene las palabras de un json y se guarda una de ellas aleatoriamiente
        let newthis = this;
        return new Promise(function (resolve, reject) {

            fetch("./js/data/words.json")
                .then((response) => response.json())
                .then((data) => {
                    newthis.palabras = data.wordList;
                }).then(() => {
                    newthis.seleccionarPalabra();
                }).then(() => {
                    resolve();
                }).catch((e) =>{
                    reject(e);
                });
        });
    }

    comprobarPalabraEnviada(a) {  // Metodo que comprueba si la letra enviada 
        let cont = 0;
        for (let j = 0; j < this.arrayLetrasVisibles.length; j++) {  //busco el numero de ocurrencias de esa letra en la palabra
            if (this.arrayObjLetras[j].getLetter() == a.toLowerCase()) {
                if (this.arrayLetrasVisibles[j]!=a){
                    this.arrayLetrasVisibles[j] = this.arrayObjLetras[j].getLetter();
                    cont++;     //cuento el numero de ocurrencias
                }else{
                    cont=-1;    //si ya esta devuelvo -1
                    break;
                }
            }
        }
        return cont;
    }

    getArrayLetras() {
        return this.arrayObjLetras;
    }

    getLetrasVisibles() {
        return this.arrayLetrasVisibles;
    }

    getTamanyoPalabra() {
        return this.tamanyoPalabra;
    }

}