let profileComponent = Vue.component("profile-component", {
    template:
        `
      <div class="d-flex justify-content-center align-items-center">

      <div class="card mb-3 " style="width: 800px">
      <div class="row">
        <div class="col-md-4">
          <img
            src="./img/profile.png"
            alt="profile"
            class="img-fluid m-3 p-2"
          />
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">Mi perfil</h5>
            <p class="mt-4">Nombre: <b>pepe</b>&nbsp;
                <button type="button" class="btn btn-sm btn-primary btn-floating">
                    <i class="fas fa-edit"></i>
                </button>
            </p>
            <div class="mt-4">
                <h6>Información</h6>
                <ul id="profileInfo" class="list-group list-group-flush">
                    <li class="list-group-item">Partidas jugadas: </li>
                    <li class="list-group-item">Victorias: </li>
                    <li class="list-group-item">Ratio: </li>
                    <li class="list-group-item">Máxima puntuación: </li>
                </ul>
            </div>
            <p class="card-text mt-4">
              <small class="text-muted">Úiltma partida jugada: </small>
            </p>
          </div>
        </div>
      </div>
    </div></div>`
});

export default profileComponent;


