const axios = require('axios');


module.exports = class APIManager {
    constructor(type = 1) {
        this.mdb_image = "https://image.tmdb.org/t/p/";
        this.mdb_image_size = "w500";
        this.type = this.typeFixed = type;
        this.apikey = "311de7310affcd6aebeacb378f22b52d";
        this.mbd_apiURL = "https://api.themoviedb.org/3/";
        this.filter = "/popular";
        this.time = "/day";
        this.page = 1;
        this.language = "es-ES";
        this.region = "ES"

    }

    getImage() {
        let self = this;

        return new Promise(function (resolve, reject) {
            self.page = self.calcularRandom(1, 61);
            let queryString = self.mbd_apiURL + self.getType() + self.getFilter() + self.getApiKey() + self.getPage() + self.getLanguage();
            if (self.typeFixed !== 0)
                queryString += self.getRegion();
            axios.get(queryString).then(function (response) {
                let data = self.procesarPalabras(response.data);
                resolve(data);
            }).catch(function (error) {
                console.log(error);
            });
        });
    }

    procesarPalabras(data) {

        let img = '';
        let palabra = '';
        let imagen = '';
        let count = 0;
        while ((img == null || img === '' || palabra.length > 45) && count < 10) {
            let index = this.calcularRandom(0, 20);
            let res = data.results[index];
            this.traducirType(res.media_type);
            switch (Number(this.type)) {
                case 1:
                    palabra = res.title;
                    img = res.backdrop_path || res.poster_path;
                    imagen = this.mdb_image + this.mdb_image_size + img;
                    break;
                case 2:
                    palabra = res.name;
                    img = res.backdrop_path || res.poster_path;
                    imagen = this.mdb_image + this.mdb_image_size + img;
                    break;
                case 3:
                    palabra = res.name;
                    img = res.profile_path;
                    imagen = this.mdb_image + this.mdb_image_size + img;
                    break;
            }
            count++;
        }
        return { palabra, imagen }
    }

    calcularRandom(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    }

    getType() {
        switch (Number(this.typeFixed)) {
            case 0:
                return "trending/all"
            case 1:
                return "movie"
            case 2:
                return "tv"
            case 3:
                return "person"
        }
    }

    traducirType(type) {
        if (this.typeFixed === 0) {

            switch (type) {
                case "all":
                    this.type = 0;
                    break;
                case "movie":
                    this.type = 1;
                    break;
                case "tv":
                    this.type = 2;
                    break;
                case "person":
                    this.type = 3;
                    break;
            }
        }else{
            this.type = this.typeFixed;
        }


    }

    getApiKey() {
        return "?api_key=" + this.apikey;
    }

    getPage() {
        return "&page=" + this.page;
    }

    getLanguage() {
        return "&language=" + this.language;
    }

    getRegion() {
        return "&region=" + this.region;
    }

    getFilter() {
        let res = '';
        if (this.typeFixed === 0)
            res = this.time;
        else
            res = this.filter;
        return res;
    }


    getType2() {
        return this.typeFixed;
    }

    setType(type) {
        this.typeFixed = Number(type);
    }

}