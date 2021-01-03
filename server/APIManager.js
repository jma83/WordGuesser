const axios = require('axios');


module.exports = class APIManager {
    constructor(type) {
        this.mdb_image = "https://image.tmdb.org/t/p/";
        this.mdb_image_size = "w500";
        this.type = type;
        this.imagen = '';
        this.palabra = '';
    }

    getImage() {
        if (Number(type) === 0) //pelis
        if (Number(type) === 1) //actores

        axios.get("https://api.themoviedb.org/3/movie/550?api_key=311de7310affcd6aebeacb378f22b52d").then(function (response) {
            console.log("Imagen: " + this.mdb_image + this.mdb_image_size + response.data.poster_path);
            console.log("Title: " + response.data.title);
        }).catch(function (error) {
            console.log(error);
        });
    }


}