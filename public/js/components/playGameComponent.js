let playGameComponent = Vue.component("play-game-component", {
    template:
        `
        <div id="game" class="card p-4 m-4">
        <h2 class="row p-2 justify-content-center">msgCabecera</h2>
        <div class="row">
            <div class="card col-6 justify-content-center">

                <!-- Card image -->
                <div class="view overlay justify-content-start align-self-start m-2 p-2">
                    <img class="card-img-top" src="https://mdbootstrap.com/img/Mockups/Lightbox/Thumbnail/img%20(67).jpg"
                    alt="Card image cap">
                    <a href="#!">
                    <div class="mask rgba-white-slight"></div>
                    </a>
                </div>

                <!-- Card content -->
                <div class="card-body justify-content-start align-self-center m-2 p-2">

                    <ul class="list-group list-group-horizontal-sm row align-self-center justify-content-start">
                        <li class="list-group-item col-2 bg-secondary h3 align-self-center palabraFin">n</li>
                        <li class="list-group-item col-2 bg-secondary h3 align-self-center palabraFin">n</li>
                        <li class="list-group-item col-2 bg-secondary h3 align-self-center palabraFin">n</li>
                        <li class="list-group-item col-2 bg-secondary h3 align-self-center palabraFin">n</li>
                        <li class="list-group-item col-2 bg-secondary h3 align-self-center palabraFin">n</li>
                        <li class="list-group-item col-2 bg-secondary h3 align-self-center palabraFin">n</li>
                        
                    </ul>


                </div>

            </div>
            <div class="col"></div>
            <div class="card col-5 m-3">
            <div class="alert alert-primary align-bottom" role="alert">
                PEPE: A simple primary alert—check it out! <br/>
                JUAN: Lorem ipsum dolor sit amet consectetur adipisicing elit <br/>
                MARIA: lakflakjlfskflañkfalksf <br/>
            </div>
            </div>
        </div>
        
        <div class="row justify-content-around">
            <div class=" col-10 col-md-4 align-self-start mt-2 p-2 ">
                <div>
                    <h5 class="card-title">Nombre: this.nombre</h5>
                    <ul class="list-group list-group-flush ">
                        <li class="list-group-item "><button type="button" class="btn btn-danger" >
                        Vidas <span class="badge badge-light">this.getVidas()</span>
                      </button></li>
                        <li class="list-group-item "><button type="button" class="btn btn-warning" >
                        Tiempo <span class="badge badge-light">this.getTiempo()</span>
                      </button></li>
                        <li class="list-group-item "><button type="button" class="btn btn-success" >
                        Visibles <span class="badge badge-light">this.getLetrasVisibles()/this.getLetrasTotales()</span>
                      </button></li>
                    </ul>
                </div>
            </div>
            <form class="col-10 col-md-3 mt-2 p-2 align-self-start">
                <div class="form-group">
                    <label for="name" >Siguiente letra: </label>
                    <input type="text" class="form-control" placeholder="Introduce letra" aria-label="Letra"
                        id="letra" name="letra"  maxlength="1">
                </div>
                <button type="submit"  v-on:click.prevent="comprobarLetraEnviada()" class="btn btn-primary">Enviar</button>
            </form>
        </div>
        <div class="row justify-content-end">
            <button type="input" v-on:click.prevent="endGameEvent()" class="btn btn-warning col-4 col-md-2 mr-5 " id="hard" name="dificultad" data-dif="2">Volver</button>
        </div>
  </div>`,
    async created() {
        const socket = await io();

        let pepe = { nombre: "jhajaj", edad: 1 };
        socket.emit('chatmessage', pepe);
        console.log(pepe)
        socket.on("mensajito", (data) => {
            alert("hola desde el server!" + data);
        })
    },
    methods: {

    }
});

export default playGameComponent;