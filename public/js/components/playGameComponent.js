let playGameComponent = Vue.component("play-game-component", {
    props: ["name", "code", "mode", "socket"],
    data: function () {
        return {
            //gm: new GameManager(this.dificultad),
            idmsg: 0,
            arrayLetras: [],
            victorias: 3,
            host: '',
            valorInput: "",
            estadoPartida: 0,
            msgCabecera: "Encuentra la palabra oculta!",
            descripcion: "Bienvenido al chat! aqui se verán reflejadas las respuestas a la palabra secreta!",
            timerId: ""
        }
    },
    template:
        `
        <div id="game" class="card p-4 m-4">
        <h2 class="row p-2 justify-content-center">{{ this.host }} - Partida: {{this.code}}</h2>
        <div class="row">
            <div class="card col-12 col-md-6 justify-content-center">

                <!-- Card image -->
                <div class="view overlay justify-content-start align-self-start m-2 p-2">
                    <img class="card-img-top" src="https://mdbootstrap.com/img/Mockups/Lightbox/Thumbnail/img%20(67).jpg"
                    alt="Card image cap">
                    <a href="">
                    <div class="mask rgba-white-slight"></div>
                    </a>
                </div>

                <!-- Card content -->
                <div class="card-body justify-content-start align-self-center m-2 p-2">

                    <ul class="list-group list-group-horizontal-sm row align-self-center justify-content-start">
                        <li class="list-group-item col-1 bg-secondary h3 align-self-center palabraFin">n</li>
                        <li class="list-group-item col-1 bg-secondary h3 align-self-center palabraFin">n</li>
                        <li class="list-group-item col-1 bg-secondary h3 align-self-center palabraFin">n</li>
                        <li class="list-group-item col-1 bg-secondary h3 align-self-center palabraFin">n</li>
                        <li class="list-group-item col-1 bg-secondary h3 align-self-center palabraFin">n</li>
                        <li class="list-group-item col-1 bg-secondary h3 align-self-center palabraFin">n</li>
                        <li class="list-group-item col-1 bg-secondary h3 align-self-center palabraFin">n</li>
                        <li class="list-group-item col-1 bg-secondary h3 align-self-center palabraFin">n</li>
                        <li class="list-group-item col-1 bg-secondary h3 align-self-center palabraFin">n</li>
                        <li class="list-group-item col-1 bg-secondary h3 align-self-center palabraFin">n</li>
                        <li class="list-group-item col-1 bg-secondary h3 align-self-center palabraFin">n</li>
                        
                    </ul>


                </div>

            </div>
            <div class="col"></div>
            <div class="card col-12 col-md-5" id="chat_container">
            <div class="alert alert-primary align-bottom" role="alert" id="chat">
               <i>Bienvenido al chat! Aqui quedarán registrados los mensajes y respuestas de todos los usuarios!</i>
            </div>
            </div>
        </div>
        
        <div class="row justify-content-around">
            <div class=" col-10 col-md-4 align-self-start mt-2 p-2 ">
                <div>
                    <h5 class="card-title">Nombre: {{this.name}}</h5>
                    <ul class="list-group list-group-flush ">
                        <li class="list-group-item "><button type="button" class="btn btn-success" >
                        Victorias <span class="badge badge-light">this.getVictorias()</span>
                      </button></li>
                        <li class="list-group-item "><button type="button" class="btn btn-danger" >
                        Tiempo <span class="badge badge-light">this.getTiempo()</span>
                      </button></li>
                      
                    </ul>
                </div>
            </div>
            <form class="col-10 col-md-3 mt-2 p-2 align-self-start">
                <div class="form-group">
                    <label for="name" >Chat de respuestas: </label>
                    <input type="text" class="form-control" placeholder="Introduce texto" aria-label="palabra"
                        id="palabra" name="palabra" maxlength="30">
                </div>
                <button type="submit"  v-on:click.prevent="enviarTexto()" class="btn btn-primary mt-2">Enviar</button>
            </form>
        </div>
        <div class="row justify-content-end">
            <button type="input" v-on:click.prevent="endGameEvent()" class="btn btn-warning col-4 col-md-2 mr-5 " id="volver" name="volver" data-dif="2">Volver</button>
        </div>
  </div>`,
    created() {
        if (Number(this.mode) === 0) {
            this.host = "Invitado";
        } else if (Number(this.mode) === 1) {
            this.host = "Anfitrión";
        }
    },

    methods: {
        endGameEvent() {
            this.$emit("end", {});
        },
        enviarTexto() {
            let palabra = document.getElementById("palabra").value;
            let nombre = this.name;

            if (palabra !== "" && palabra !== null) {
                const socket = io();
                this.idmsg++;
                let self = this;
                let idmsg = this.idmsg;
                document.getElementById("palabra").value = "";
                socket.emit('mensaje', {idmsg,nombre,palabra});
                
                socket.on("mensaje_chat", (data) => {
                    console.log(self.idmsg + " y "+ data.idmsg)
                    if (data.idmsg >= self.idmsg)
                    document.getElementById("chat").innerHTML += "<p><b>" + data.nombre + ":</b> " + data.palabra + "</p>";
                });
            }
        }
    }
});

export default playGameComponent;