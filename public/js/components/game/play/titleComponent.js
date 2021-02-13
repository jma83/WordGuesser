let titleComponent = Vue.component("title-component", {
  props: ["ganador", "host", "code", "serverInfo"],
  data: function () {
    return {
        msgCabecera: "Encuentra la palabra oculta!",
    }
},
  template:
    `<div>
      <h2 class="row p-2 align-self-center justify-content-center" v-if="this.serverInfo.estado === 0">{{ this.host }} - Partida: {{this.code}}</h2>
        <h3 class="row p-2 align-self-center justify-content-center" v-if="this.serverInfo.estado === 1">{{ this.msgCabecera}}</h3>
        <h2 class="row p-2 align-self-center justify-content-center" v-if="this.serverInfo.estado === 1">Ronda: {{ this.serverInfo.ronda}}/{{ this.serverInfo.maxRondas}} - &nbsp;
        <span class="badge bg-danger col-12 col-md-4 col-lg-2"> Tiempo: {{this.serverInfo.tiempo}}</span></h2>
        
        <template v-if="this.serverInfo.estado === 2 ">
          <h2 v-if="this.ganador.length === 1" class="row p-2 align-self-center justify-content-center" >
          El Ganador es {{this.ganador[0].nombre}}!
          </h2>
          <h2 v-if="this.ganador.length > 1" class="row p-2 align-self-center justify-content-center" >
          Hay un empate! Entre: <template v-for="g in this.ganador">{{ g.nombre }} </template>
          </h2>
         
        </template>
        
      </div>`,

});

export default {
  titleComponent
}


