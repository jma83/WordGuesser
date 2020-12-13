let welcomeComponent = Vue.component("welcome-component", {
    template:
      `
      <div class="d-flex justify-content-center align-items-center">
        <div class="text-center">
            <h1 class=" text-one" style="color: #6a8255 ;">Welcome!</h1>
            <p class="mt-4 text-two">
                It's a Websocket game!
            </p>
            <router-link to="/game" class="btn btn-danger text-white btn-rounded btn-lg" href=""><i
                    class="fas fa-play"></i> START</router-link>
        </div>
      </div>`
  });
  
  export default welcomeComponent;


