let playerInfoComponent = Vue.component("player-info-component", {
    props: ["name","timer","victorias"],
    template:
    `<div>
        <h5 class="card-title">Nombre: {{this.name}}</h5>
        <ul class="list-group list-group-flush ">
            <li class="list-group-item "><button type="button" class="btn btn-success" >
            Victorias <span class="badge badge-light bg-light text-dark"> {{this.victorias}}</span>
        </button></li>
            <li class="list-group-item "><button type="button" class="btn btn-danger" >
            Tiempo <span class="badge badge-light bg-light text-dark"> {{this.timer}}</span>
        </button></li>
        </ul>
    </div>`
  });
  
  export default {
    playerInfoComponent
  }


