import './headerComponent.js';
import './footerComponent.js';
import './welcomeComponent.js';
import router from '../routes.js'


let miapp = new Vue({
    el: "#miapp",
    data: {
        startedGame: false,
        dificultad: 0,
        nombre: ""
    },
    template: `
    <div>
        <header-component class="mb-5"></header-component>
        <main class="container">
            <!--<p>
                <router-link to="/game">Go to Game</router-link>
                <router-link to="/about">Go to About</router-link>
            </p>-->
            <router-view></router-view>

        </main>
        
        <footer-component class="mt-5"></footer-component>
    </div>`
    , router,
    computed: {
        getAllRefs: function () {
            return this.$refs
        }
    }
});

class mainClass{
    constructor(miapp){
        this.instance = miapp;
    }
}

let main = new mainClass(miapp);

export default main;