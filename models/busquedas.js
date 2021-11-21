const fs = require('fs');
const axios = require('axios');

class Buquedas {

    historial = [];
    dbPath = './db/database.json';

    constructor() {
        this.leerDB();
    }

    get mapboxParams() {
        return {
            'language': 'es',
            'access_token': process.env.MAPBOX_KEY
        }
    }

    get openweatherParams() {
        return {
            'appid': process.env.OPENWEATHER_KEY,
            'lang': 'es',
            'units': 'metric'
        }
    }

    async ciudad(lugar = '') {

        try {

            const axiosClient = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json?`,
                params: this.mapboxParams
            })

            const res = await axiosClient.get();

            return res.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name_es,
                longitud: lugar.center[0],
                latitud: lugar.center[1]
            }))

        } catch (error) {

            console.log(error);
            throw error;

        }
    }

    async climaCiudad(lon, lat) {

        try {

            const axiosClient = axios.create({
                baseURL: 'https://api.openweathermap.org/data/2.5/weather?',
                params: { ...this.openweatherParams, lat, lon }
            });

            const res = await axiosClient.get();

            const { weather, main } = res.data;

            return {
                'desc': weather[0].description,
                'temperatura': main.temp,
                'min': main.temp_min,
                'max': main.temp_max
            }

        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    agregarHistorial(lugar = '') {

        if (this.historial.includes(lugar)) {
            return;
        }

        this.historial = this.historial.splice(0, 5);
        this.historial.unshift(lugar);

        // Guardar en DB:
        this.guardarDB();

    }

    guardarDB() {

        const payload = {
            historial: this.historial
        }

        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
    }

    leerDB() {

        if (!fs.existsSync(this.dbPath)) return;


        const info = fs.readFileSync(this.dbPath, { encoding: 'utf-8' })
        const data = JSON.parse(info);

        this.historial = data.historial;
    }
}

module.exports = Buquedas;