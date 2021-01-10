const about = { template: '<div>ABOUT</div>' }
import welcomeComponent from './components/welcomeComponent.js';
import gameComponent from './components/gameComponent.js';
import profileComponent from './components/profileComponent.js';


let eventBus = new Vue();
const routes = [
  { path: '/', component: welcomeComponent, exact: true },
  { path: '/game', component: gameComponent, props: {eventBus} },
  { path: '/about', component: about },
  { path: '/profile', component: profileComponent, props: {eventBus} }
]

let router = new VueRouter({
  routes 
})


export default {router,eventBus};