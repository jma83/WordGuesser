let profileComponent = Vue.component("profile-component", {
    props: ["eventBus"],
    data: function () {
        return {
            nombre: '',
            victorias: 0,
            ratio: 0,
            puntuacion: 0,
            partidas: 0,
            fecha: '',
        }
    },
    template:
        `
      <div class="d-flex justify-content-center align-items-center">

      <div class="card mb-3 " style="width: 800px">
        <div class="row">
            <div class="col-md-4">
            <img
                src="./img/profile.png"
                alt="profile"
                class="img-fluid m-3 p-2"
            />
            </div>
            <div class="col-md-8">
                <div class="card-body">
                    <h5 class="card-title">Mi perfil</h5>
                    <div class="mt-4">Nombre: 
                    <div class="form-outline mb-3 row" style="width: 22rem">
                        <input class="form-control w-50 border" id="nombreProfile" type="text"  v-model="this.nombre" />
                        <button type="button" class="btn btn-sm btn-primary btn-floating" v-on:click="setName()">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                    
                    </p>
                    <div class="mt-4">
                        <h6>Información</h6>
                        <ul id="profileInfo" class="list-group list-group-flush">
                            <li class="list-group-item">Partidas jugadas: {{this.partidas}} </li>
                            <li class="list-group-item">Victorias: {{this.victorias}}</li>
                            <li class="list-group-item">Ratio: {{this.ratio}} %</li>
                            <li class="list-group-item">Máxima puntuación: {{this.puntuacion}} </li>
                        </ul>
                    </div>
                    <p class="card-text mt-4">
                    <small class="text-muted">Úiltma partida jugada: {{this.fecha}}</small>
                    </p>
                </div>
            </div>
        </div>
    </div>
    </div>
    </div>`,
    created() {
        this.actualizarPerfil();

    },
    methods: {
        setName(){
            let nombreProfile = document.getElementById("nombreProfile").value;
            localStorage.setItem("nombre",nombreProfile);
            this.eventBus.$emit("setNombre",{});
        },
        actualizarPerfil() {
            console.log(localStorage.getItem("victorias"))
            if (localStorage.getItem("nombre")!=null)
            this.nombre = localStorage.getItem("nombre");
            if (localStorage.getItem("victorias")!=null)
            this.victorias = localStorage.getItem("victorias");
            if (localStorage.getItem("partidas")!=null)
            this.partidas = localStorage.getItem("partidas");
            if (localStorage.getItem("puntuacion")!=null)
            this.puntuacion = localStorage.getItem("puntuacion");
            if (Number(this.partidas)!==0)
                this.ratio = Math.trunc((this.victorias * 100) / this.partidas);
            

            if (localStorage.getItem("fecha")!=null){
                this.fecha = d.toUTCString();
            }else{
                this.fecha = "Sin partidas";
            }
        },
    }
});

export default profileComponent;


