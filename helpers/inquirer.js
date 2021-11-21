const inquirer = require('inquirer');
const colors = require('colors');


const menu = async () => {

    const opcion = [
        {
            type: 'list',
            name: 'opt',
            message: 'Qué desea hacer?',
            choices: [
                { value: 1, name: `${colors.green('1.')} Buscar Ciudad` },
                { value: 2, name: `${colors.green('2.')} Historial` },
                { value: 0, name: `${colors.green('0.')} Salir` },
            ]
        }
    ]

    console.clear();
    console.log(colors.green('================================'));
    console.log(colors.green(' Seleccione opción del menú'));
    console.log(colors.green('================================'));
    console.log(`\n`);

    const { opt } = await inquirer.prompt(opcion);
    return opt;

}


const pausa = async () => {

    const accion = [
        {
            type: 'input',
            name: 'accion',
            message: `Presione ${colors.green("ENTER")} para continuar`
        }
    ]

    console.log(`\n`);
    await inquirer.prompt(accion);
}

const leerInput = async (message) => {

    const pregunta = [
        {
            type: 'input',
            name: 'lugar',
            message,
            validate(value) {

                if (value.length === 0) {
                    return 'Por favor ingrese un valor';
                }
                return true;
            }
        }
    ];

    const { lugar } = await inquirer.prompt(pregunta);
    return lugar;
}

const listarLugares = async (lugares = []) => {

    const choices = lugares.map((lugar, index) => {

        let i = colors.green(`${index + 1}.`);

        return {
            value: lugar.id,
            name: `${i} ${lugar.nombre}`
        }
    });

    choices.unshift({
        value: 0,
        name: `${colors.green('0.')} Cancelar`
    });

    const preguntas = [
        {
            type: 'list',
            name: 'id',
            message: 'Seleccione Lugar: ',
            choices
        }
    ]

    const { id } = await inquirer.prompt(preguntas);

    return id;
}

module.exports = {
    menu,
    pausa,
    leerInput,
    listarLugares
}