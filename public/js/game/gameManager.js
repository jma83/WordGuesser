//import WordManager from './wordManager.js'

//controla si se gana o pierde
//la dificultad
//llama al gestor de palabras
export default class GameManager {
    constructor() {

        //coge la configuracion del jugador
        this.publicRoom = false;
        this.maxPlayers = 4;
        this.rounds = 1;
        this.timePerRound = 30;
        this.lifesPerRound = -1;
        this.dificultad = 0; //letrasSugeridas
        //se la pasa al wordManager creado

    }

    selectConfiguration(config) {   //metodo que selecciona la configuración de inicio de partida
        let newthis = this;
        return new Promise(function (resolve, reject) {

            newthis.publicRoom = config.publicRoom;
            newthis.maxPlayers = Number(config.maxPlayers);
            newthis.timePerRound = Number(config.time);
            newthis.lifesPerRound = Number(config.lifes);
            newthis.dificultad = Number(config.dificultad);; //letrasSugeridas
            newthis.rounds = Number(config.rounds);


            resolve();
        });
        //this.wordManager
    }



    decreaseTime() {
        if (this.time > 0)
            this.time--;
        else
            return true;
        return false;

    }

    decreaseLife() {
        this.lifes--;
    }

    addLetraVisible(a) {
        this.letrasVisiblesIni += a;
    }

    comprobarFinPartida() {
        let i = 0;
        if (this.wordManager.checkGuessedWord() === true) {
            //Win!
            i = 1;
        } else if (this.lifes <= 0 || this.time <= 0) {
            //Lose!
            i = 2;
        }
        return i;
    }

    getWordManager() {
        return this.wordManager;
    }

    getVidas() {
        return this.lifes;
    }

    getTiempo() {
        return this.time;
    }

    getLetrasVisiblesIni() {
        return this.letrasVisiblesIni;
    }
}