import './headerComponent.js';
import './footerComponent.js';
import './welcomeComponent.js';
import router from '../routes.js'

let miapp = new Vue({
    el: "#miapp",
    data: {
        eventBus: new Vue()
    },
    template: `
    <div>
        <header-component class="mb-5" v-bind:eventBus="this.eventBus"></header-component>
        <main class="container">
            <router-view :eventBus="eventBus"></router-view>
        </main>
        
        <footer-component class="mt-5"></footer-component>
    </div>`
    , router
});
