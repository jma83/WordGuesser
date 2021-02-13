import * as ConsClass from './constants.js'


export default class Utils {
    static checkValid(val) {
        if (val != null && val !== "" && Number(val) !== 0) {
            return true;
        }
        return false;
    }

    static responsive(flag) {
        if (!flag) {
            document.getElementById(ConsClass.FOOTER_ELEMENT).style.position = "absolute";
        } else {
            document.getElementById(ConsClass.FOOTER_ELEMENT).style.position = "relative";
        }
    }

    static getNombreSession() {
        let nombre = sessionStorage.getItem(ConsClass.SESION_NOMBRE);
        return nombre || "";
    }
    static comprobarSession() {
        let nombre = sessionStorage.getItem(ConsClass.SESION_NOMBRE);
        if (nombre !== '' && nombre != null) {
            return true;
        }
        return false;
    }
    static comprobarLocalStorage() {
        let nombre = localStorage.getItem(ConsClass.LOCAL_NOMBRE);
        if (nombre !== '' && nombre != null) {
            return true;
        }
        return false;
    }

    static getNombreLocal() {
        let nombre = localStorage.getItem(ConsClass.LOCAL_NOMBRE);
        return nombre || "";
    }

    static borrarStorage() {
        sessionStorage.clear();
        localStorage.clear();
    }
}