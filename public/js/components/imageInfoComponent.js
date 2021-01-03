let imageInfoComponent = Vue.component("image-info-component", {
    props: ["image","palabra"],
    template:
    `<div>

        <!-- Card image -->
        <div class="view overlay justify-content-start align-self-start m-2 p-2">
            <img class="card-img-top" v-bind:src="this.image" v-bind:alt="this.palabra">
            <a href="">
            <div class="mask rgba-white-slight"></div>
            </a>
        </div>

        <!-- Card content -->
        <div class="card-body justify-content-start align-self-center m-2 p-2">

            <ul class="list-group list-group-horizontal-sm row align-self-center justify-content-start">
                <li class="list-group-item col-1 bg-secondary h3 align-self-center palabraFin">n</li>
                <li class="list-group-item col-1 bg-secondary h3 align-self-center palabraFin">n</li>
                <li class="list-group-item col-1 bg-secondary h3 align-self-center palabraFin">n</li>
                <li class="list-group-item col-1 bg-secondary h3 align-self-center palabraFin">n</li>
                <li class="list-group-item col-1 bg-secondary h3 align-self-center palabraFin">n</li>
                <li class="list-group-item col-1 bg-secondary h3 align-self-center palabraFin">n</li>
                <li class="list-group-item col-1 bg-secondary h3 align-self-center palabraFin">n</li>
                <li class="list-group-item col-1 bg-secondary h3 align-self-center palabraFin">n</li>
                <li class="list-group-item col-1 bg-secondary h3 align-self-center palabraFin">n</li>
                <li class="list-group-item col-1 bg-secondary h3 align-self-center palabraFin">n</li>
                <li class="list-group-item col-1 bg-secondary h3 align-self-center palabraFin">n</li>
                
            </ul>


        </div>
    </div>`
  });
  
  export default {
    imageInfoComponent
  }


