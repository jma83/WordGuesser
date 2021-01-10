import './verAjustesComponent.js';
import './modAjustesComponent.js';

let ajustesComponent = Vue.component("ajustes-component", {
    props: ["editable", "serverInfo", "tiempoAux"],
    template:
        `<div>
            <mod-ajustes-component v-if="this.editable===true" v-bind:tiempoAux="this.tiempoAux" ></mod-ajustes-component>
            <ver-ajustes-component v-else v-bind:serverInfo="this.serverInfo"></ver-ajustes-component>
        </div>`,
});

export default {
    ajustesComponent
}


