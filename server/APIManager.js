const axios = require('axios');


module.exports = class APIManager {
    constructor(type = 0) {
        this.mdb_image = "https://image.tmdb.org/t/p/";
        this.mdb_image_size = "w500";
        this.type = type;

    }

    getImage() {
        //if (Number(type) === 0) //pelis
        //if (Number(type) === 1) //actores
        let self = this;

        return new Promise(function (resolve, reject) {
            let palabra = '';
            let imagen = '';
            axios.get("https://api.themoviedb.org/3/movie/550?api_key=311de7310affcd6aebeacb378f22b52d").then(function (response) {
                console.log("OBTENGO LA PALABRA!")
                console.log("Imagen: " + self.mdb_image + self.mdb_image_size + response.data.poster_path);
                console.log("Title: " + response.data.title);
                imagen = self.mdb_image + self.mdb_image_size + response.data.poster_path;
                palabra = response.data.title;
                let data = { palabra, imagen };
                resolve(data);
            }).catch(function (error) {
                console.log(error);
            });
            return '';

        });


    }

}