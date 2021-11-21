
require('dotenv').config();
const colors = require('colors');

const { menu, pausa, leerInput, listarLugares } = require('./helpers/inquirer');
const Busquedas = require('./models/busquedas');


console.clear();

const main = async () => {

    const busquedas = new Busquedas();
    let opt;

    do {

        opt = await menu();
        // console.log(opt);

        switch (opt) {
            case 1:
                // Mostrar mensaje:
                const termino = await leerInput('Ciudad:');

                // Buscar lugares:
                console.log();
                const lugares = await busquedas.ciudad(termino);

                // Seleccionar el lugar:
                const id = await listarLugares(lugares);

                if (id !== 0) {

                    const lugarSeleccionado = lugares.find(lugar => lugar.id === id);
                    const { nombre, longitud, latitud } = lugarSeleccionado;

                    // Guardar en el historial:
                    busquedas.agregarHistorial(nombre);

                    // Clima:
                    const climaLugar = await busquedas.climaCiudad(longitud, latitud);
                    const { desc, temperatura, min, max } = climaLugar;


                    // Mostrar resultados:
                    console.clear();
                    console.log(`\n${colors.green("Información de la ciudad")}\n`);
                    console.log(`Ciudad: ${colors.blue(nombre)}`);
                    console.log(`Longitud: ${colors.blue(longitud)}`);
                    console.log(`Latitud: ${colors.blue(latitud)}`);
                    console.log(`Temperatura: ${colors.blue(temperatura)}`);
                    console.log(`Temp Mínima: ${colors.blue(min)}`);
                    console.log(`Temp Máxima:${colors.blue(max)}`);
                    console.log(`Como esta el clima:${colors.blue(desc)}`);

                }

                break;

            case 2:

                busquedas.historial.forEach((lugar, i) => {

                    const idx = `${1 + i}.`;
                    console.log(colors.green(idx), lugar);
                })

                break;

        }


        if (opt !== 0) await pausa();

    } while (opt !== 0);

}

main();