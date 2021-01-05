let lobbyComponent = Vue.component("lobby-component", {
  props: ["players", "id", "maxPlayers"],
  template:
    `<div>
        <h3>Lobby!</h3>
        <p>Jugadores Conectados {{this.getNumPlayers()}}/{{this.maxPlayers}}</p>
        <ul class="list-group">
          <li v-for="n in getPlayers()" v-bind:key="n.id" v-bind:id="n.id" class="list-group-item players">{{n.name}} 
            <span v-if="checkAnfitrion(n)">(Anfitrión)</span>
            <span v-if="n.siguiente === true" class="badge bg-success">Listo</span>
            <span v-else class="badge bg-danger">No listo</span>
          </li>
        
        </ul>
    </div>`,

  updated() {
    let players = document.getElementsByClassName("players");
    players.forEach(element => {
      console.log(element.getAttribute("id"))

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
  lobbyComponent
}


