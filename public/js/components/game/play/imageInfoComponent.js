let imageInfoComponent = Vue.component("image-info-component", {
    props: ["image", "palabra"],
    template:
        `<div>

        <div class="view overlay justify-content-start align-self-start m-2 p-2">
            <img class="card-img-top" v-bind:src="this.image" v-bind:alt="this.palabra" id="image_container">
            <div class="mask rgba-white-slight"></div>
        </div>
        <div class="card-body justify-content-center align-self-center m-2 p-2">
            <ul class="list-group list-group-horizontal-sm row align-self-center justify-content-start">
                <li v-for="n in getArrayLetras()"  class="list-group-item col-1 h3 align-self-center palabraFin">{{n}}</li>                
            </ul>
        </div>
    </div>`,
    methods: {
        getArrayLetras() {
            return Array.from(this.palabra);
        },
    }
});

export default {
    imageInfoComponent
}


