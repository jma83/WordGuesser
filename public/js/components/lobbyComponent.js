let lobbyComponent = Vue.component("lobby-component", {
  props: ["players","name"],
  data: function () {
    return {
        //gm: new GameManager(this.dificultad),
        names: [],
    }
  },
  template:
    `<div>
        <h3>Lobby!</h3>
        <p>Jugadores Conectados {{this.getNumPlayers()}}</p>
        <ul class="list-group">
          
          <li v-for="n in getPlayers()" v-if="name !== n.name"  class="list-group-item">{{n.name}} <span v-if="getPlayers()[0].name === n.name">(Anfitrión)</span>
            <span v-if="n.siguiente === true" class="badge bg-success">Listo</span>
            <span v-else class="badge bg-danger">No listo</span>
          </li>
          <li v-for="n in getPlayers()" v-if="name === n.name"  class="list-group-item active">{{n.name}} <span v-if="getPlayers()[0].name === n.name">(Anfitrión)</span>
            <span v-if="n.siguiente === true" class="badge bg-success">Listo</span>
            <span v-else class="badge bg-danger">No listo</span>
            </li>
        </ul>
    </div>`,
    methods: {
      getPlayers() {
          return this.players;
      },
      getNumPlayers() {
        return this.players.length;
    }
  }
});

export default {
  lobbyComponent
}


