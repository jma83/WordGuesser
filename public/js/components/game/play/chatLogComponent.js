

let chatLogComponent = Vue.component("chat-log-component", {
    props: ["mensajesChat"],
    data: function () {
        return {
            descripcion: "Bienvenido al chat! Aqui quedarán registrados los mensajes y respuestas de todos los usuarios!",
        }
    },
    template:
    `<div class="alert alert-primary align-bottom" role="alert" id="chat">
        <p><i>{{this.descripcion}}</i></p>
        <p v-for="(mensaje,index) in mensajesChat" v-bind:key="index">
            <i v-if="mensaje.serverFlag" > - <b>{{mensaje.nombre}}</b> {{mensaje.mensaje}} </i>
            <span v-else><b>{{mensaje.nombre}}</b> {{mensaje.mensaje}} </span>
        </p>
    </div>`,
});

export default {
    chatLogComponent
}


