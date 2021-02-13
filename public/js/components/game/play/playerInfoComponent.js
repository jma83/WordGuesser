let playerInfoComponent = Vue.component("player-info-component", {
    props: ["players", "id", "serverInfo"],
    template:
        `<div>
              <h3 v-show="serverInfo.estado === 0">Sala de espera</h3>
              <p>Jugadores Conectados {{this.getNumPlayers()}}/{{this.serverInfo.maxPlayers}}</p>
              <ul class="list-group row">
                <li v-for="n in getPlayers()" v-bind:key="n.id" v-bind:id="n.id" class="list-group-item players col"> 
                  {{n.nombre}}  
                  <span v-if="checkAnfitrion(n)">(Anfitrión)</span>
                  <span v-if="n.siguiente === true && (serverInfo.finRonda === true || serverInfo.estado === 0)" class="badge bg-success">Listo</span>
                  <span v-if="n.siguiente === false  && (serverInfo.finRonda === true || serverInfo.estado === 0)" class="badge bg-danger">No listo</span>
                  <span v-show="serverInfo.estado !== 0" class="badge bg-success align-self-end justify-content-end">Puntos: {{n.puntos}}</span>
                </li>
              
              </ul>
          </div>`,

    updated() {
        let players = document.getElementsByClassName("players");
        players.forEach(element => {
            if (element.getAttribute("id") === this.id)
                element.classList.add("active");
        });
    },
    methods: {
        getPlayers() {
            return this.players;
        },
        getNumPlayers() {
            return this.players.length;
        },
        checkAnfitrion(n) {
            if (this.getPlayers()[0].id === n.id) {
                return true;
            }
            return false;
        }
    }
});


export default {
    playerInfoComponent
}


