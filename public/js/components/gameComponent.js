import './playGameComponent.js';
import './selectionComponent.js';


let gameComponent = Vue.component("game-component", {
    data: function () {
        return {
            startedGame: false,
            nombre: '',
            codigo: -1,
            modo: -1

        }
    },
    template: `
    <div>
        <div class="container">
            <div v-if="startedGame === false">
                <selection-component v-on:start="startGame"></selection-component>
            </div>
            <div v-else>
                <play-game-component></play-game-component>
            </div>
        </div>
    </div>`,

    methods: {
        startGame(dat){
            this.startedGame = true;
            this.modo = dat.modo;
            this.nombre = dat.nombre;
            this.codigo = dat.codigo;
            console.log(dat)
        }
    }
})
export default gameComponent;
