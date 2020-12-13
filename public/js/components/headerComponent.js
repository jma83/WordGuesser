let headerComponent = Vue.component("header-component", {
  template:
    `<header>
      <nav class="navbar navbar-dark bg-dark">
        <router-link to="/" class="navbar-brand">
          <img src="" width="54" height="54" class="d-inline-block align-top float-left mr-2"
            alt="logo" />
          <h1 class="float-left">Websockets!</h1>
        </router-link>
      </nav>
    </header>`
});

export default {
  headerComponent,
}