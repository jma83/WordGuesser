import './headerComponent.js';
import './footerComponent.js';
import './welcomeComponent.js';
import r from '../routes.js'

let router = r.router;
let eventBus = r.eventBus;

let miapp = new Vue({
    el: "#miapp",
    data: {
        eventBus: eventBus
    },
    template: `
    <div>
        <header-component class="mb-5" v-bind:eventBus="this.eventBus"></header-component>
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