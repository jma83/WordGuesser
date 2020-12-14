let headerComponent = Vue.component("header-component", {
  template:
    `<header>
      <nav class="mb-1 navbar navbar-expand-lg navbar-dark bg-dark">
      <router-link to="/" class="navbar-brand">
          <img src="" width="54" height="54" class="d-inline-block align-top float-left mr-2"
            alt="logo" />
          <h1 class="float-left">Websockets!</h1>
        </router-link>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent-4" aria-controls="navbarSupportedContent-4" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent-4">
          <ul class="navbar-nav ml-auto">
              <li class="nav-item active">
                  <router-link to="/about" class="navbar-brand">
                      <i class="fas fa-envelope"> </i> &nbsp; About
                      <span class="sr-only">(current)</span>
                  </router-link>
              </li>
              <li class="nav-item dropdown">
                  <a class="nav-link dropdown-toggle waves-effect waves-light" id="navbarDropdownMenuLink-4" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                      <i class="fas fa-user"></i> Profile </a>
                  <div class="dropdown-menu dropdown-menu-right dropdown-info" aria-labelledby="navbarDropdownMenuLink-4">
                      <a class="dropdown-item waves-effect waves-light" href="#">My account</a>
                      <a class="dropdown-item waves-effect waves-light" href="#">Log out</a>
                  </div>
              </li>
          </ul>
      </div>
  </nav>
  </header>`
});

export default {
  headerComponent,
}