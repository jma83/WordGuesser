let chatFormComponent = Vue.component("chat-form-component", {
    data: function () {
        return {
            texto: ''
        }
    },
    template:
    `<form>
        <div class="form-group">
            <label for="name" >Chat de respuestas: </label>
            <input type="text" class="form-control" placeholder="Introduce texto" aria-label="mensaje"
                id="mensaje" name="mensaje" maxlength="150" v-model="texto" >
        </div>
        <button type="submit" v-on:click.prevent="enviarTexto()" class="btn btn-primary mt-2"><i class="far fa-paper-plane"></i> &nbsp; Enviar</button>
    </form>`,
    methods: {
        enviarTexto() {
            this.$emit("enviarTexto",this.texto);
            this.texto = "";
            document.getElementById("mensaje").focus();
        },
    },
});

export default {
    chatFormComponent
}


