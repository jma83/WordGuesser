let lobbyComponent = Vue.component("lobby-component", {
  props: ["players","name","mode"],
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
          <!--<li class="list-group-item active" aria-current="true">Cras justo odio</li>-->
          <li v-for="n in getPlayers()" class="list-group-item ">{{n}} <span v-if="getPlayers()[0] === n">(Anfitrión)</span></li>
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


