const about = { template: '<div>ABOUT</div>' }
import welcomeComponent from './components/welcomeComponent.js';
import gameComponent from './components/gameComponent.js';
import profileComponent from './components/profileComponent.js';


const routes = [
  { path: '/', component: welcomeComponent, exact: true },
  { path: '/game', component: gameComponent, props: true },
  { path: '/about', component: about },
  { path: '/profile', component: profileComponent, props: true }
]

let router = new VueRouter({
  routes 
})


export default router;