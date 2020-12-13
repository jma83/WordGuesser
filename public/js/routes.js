const about = { template: '<div>ABOUT</div>' }
import welcomeComponent from './components/welcomeComponent.js';
import gameComponent from './components/gameComponent.js';


const routes = [
  { path: '/', component: welcomeComponent },
  { path: '/game', component: gameComponent },
  { path: '/about', component: about },
]

let router = new VueRouter({
  routes 
})


export default router;