import welcomeComponent from './components/welcome/welcomeComponent.js';
import gameComponent from './components/game/gameComponent.js';
import profileComponent from './components/profile/profileComponent.js';
import aboutComponent from './components/about/aboutComponent.js';


const routes = [
  { path: '/', component: welcomeComponent, exact: true },
  { path: '/game', component: gameComponent, props: true },
  { path: '/about', component: aboutComponent },
  { path: '/profile', component: profileComponent, props: true }
]

let router = new VueRouter({
  routes 
})


export default router;