let titleComponent = Vue.component("title-component", {
    props: ["ganador", "host", "code", "serverInfo"],
    template:
      `<div>
        <h2 class="row p-2 align-self-center justify-content-center" v-if="this.serverInfo.estado === 0">{{ this.host }} - Partida: {{this.code}}</h2>
        <h2 class="row p-2 align-self-center justify-content-center" v-if="this.serverInfo.estado === 1">Ronda: {{ this.serverInfo.ronda}}/{{ this.serverInfo.maxRondas}} - &nbsp;
        <button type="button" class="btn btn-danger col-2">Tiempo <span class="badge badge-light bg-light text-dark"> {{this.serverInfo.tiempo}}</span></button></h2>
        <h2 class="row p-2 align-self-center justify-content-center" v-if="this.serverInfo.estado === 2">Gana el jugador: {{this.ganador.nombre}}!</h2>
      </div>`,
  
  });
  
  export default {
    titleComponent
  }
  
  
  