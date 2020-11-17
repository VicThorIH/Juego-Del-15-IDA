'use strict'
const solucion = [
    "1", "2", "3", "4",
    "5", "6", "7", "8",
    "9", "10", "11", "12",
    "13", "14", "15", "0"
];



var tablero = [
    "1", "2", "3", "4",
    "5", "6", "7", "8",
    "9", "10", "11", "12",
    "13", "14", "15", "0"

];



var NO_MOVIMIENTOS = 0;
var MEJOR_SOLUCION = [];
var SOLUCION_ACTUAL = [];
var SIGUIENTES_COTAS = [];


function IDA(tabl, movimiento_ant, heuristica) {

    if (tabl.toString() == solucion.toString()) {
        for (const paso in SOLUCION_ACTUAL) {
            MEJOR_SOLUCION.push(SOLUCION_ACTUAL[paso]);
        }
        return;
    }

    if (MEJOR_SOLUCION.length != 0) {
        return;
    }

    //AQUI VALIDAR LAS PROFUNDIDADES
    let h;
    // console.log(`tabl:`);
    // console.log(tabl);
    switch (heuristica) {
        case 'h1':
            h = h1(tabl);
            break;
    }
    // console.log(`h: ${h}`);
    let cota = h + SOLUCION_ACTUAL.length;
    // console.log(`Cota: ${cota}\nProfundidad: ${SOLUCION_ACTUAL.length}`);
    // console.log(`COTA_ACTUAL = ${COTA_ACTUAL}`);
    if (cota > COTA_ACTUAL) {
        return;
    }


    var nuevo_mov;
    var ya_movidos = [];
    let nuevosTableros = [];
    for (let index = 0; index < 4; index++) {
        //REGRESAR EL CERO A SU LUGAR
        if (index != 0) {
            regresar_cero(tabl, ya_movidos[ya_movidos.length - 1]);
        }

        //Verificar que haya movimientos
        if (calcular_mov_restantes(tabl.indexOf("0"), ya_movidos, movimiento_ant).length === 0) {
            break;
        }
        //AQUI SE MUEVE EL CERO
        nuevo_mov = mover_cero(tabl, ya_movidos, movimiento_ant);
        ya_movidos.push(nuevo_mov);
        //METER LOS TABLEROS GENERADOS EN UN ARREGLO
        let auxTbl = [];
        tabl.forEach(element => {
            auxTbl.push(element)
        });
        //ARREGLO DE TABLEROS
        nuevosTableros.push([auxTbl, (h1(auxTbl) + SOLUCION_ACTUAL.length), ya_movidos[ya_movidos.length - 1]]);

     
    }

    //OBTENER LA SIGUIENTE COTA MAS PEQUEÑA
    let sigCota = nuevosTableros.filter(mayorQueCota);
    let auxArreglo = [];

    for (let index = 0; index < sigCota.length; index++) {
        auxArreglo.push(sigCota[index][1]);
    }

    auxArreglo = auxArreglo.sort((a, b) => a - b);

    SIGUIENTES_COTAS = auxArreglo.reduce(
        (newTempArr, el) =>
            newTempArr.includes(el) ? newTempArr : [...newTempArr, el],
        []
    );

    // console.log(`SIG COTA`);
    // console.log(sigCota);

    //SE OBTIENEN LOS QUE SON MENORES QUE LA COTA ACTUAL
    let menorCota = nuevosTableros.filter(menorQueCota);


    //ORDENAR EL ARREGLO DE MENOR A MAYOR
    auxArreglo = [];
    for (let index = 0; index < menorCota.length; index++) {
        auxArreglo.push(menorCota[index][1]);
    }
    auxArreglo = auxArreglo.sort((a, b) => a - b);
    //console.log(auxArreglo);
    let auxArreglo2 = [];
    for (let i = 0; i < auxArreglo.length; i++) {

        for (let j = 0; j < menorCota.length; j++) {
            if (menorCota[j][1] === auxArreglo[i]) {
                auxArreglo2.push(menorCota[j]);
                menorCota.splice(j, 1);
                break;
            }

        }
    }

    //TENEMOS EL ARREGLO QUE CONTIENE A LOS CAMINOS MENORES A LA COTA ACTUAL Y ORDENADOS DE MENOR A MAYOR
    menorCota = auxArreglo2;
   

    nuevo_mov = [];
    ya_movidos = [];
    for (let index = 0; index < menorCota.length; index++) {

        if (MEJOR_SOLUCION.length != 0) {
            break;
        }

        // console.log('indets');
        // console.log(menorCota[index]);
        if (index != 0) {
            regresar_cero(tabl, ya_movidos[ya_movidos.length - 1]);
        }

        //Verificar que haya movimientos
        if (calcular_mov_restantes(tabl.indexOf("0"), ya_movidos, movimiento_ant).length === 0) {
            break;
        }

        nuevo_mov = mover_cero(tabl, ya_movidos, movimiento_ant, menorCota[index][2]);
        ya_movidos.push(nuevo_mov);

        NO_MOVIMIENTOS++;

        SOLUCION_ACTUAL.push(ya_movidos[ya_movidos.length - 1]);
        //console.log('Solucion actual', SOLUCION_ACTUAL);
        IDA(menorCota[index][0], nuevo_mov, 'h1');
        SOLUCION_ACTUAL.splice(SOLUCION_ACTUAL.length - 1);


    }

    




}





function menorQueCota(value) {
    return value[1] <= COTA_ACTUAL;
}

function mayorQueCota(value) {
    return value[1] > COTA_ACTUAL;
}

function minCotas(value) {
    return value[1] <= this;
}


//HEURISTICA h1 > distancia de cada numero a su posicion final
function h1(tablero) {

    let cordenadasObjetivo = ['3,3', '0,0', '0,1', '0,2', '0,3', '1,0', '1,1', '1,2', '1,3', '2,0', '2,1', '2,2', '2,3', '3,0', '3,1', '3,2'];
    let cordenadasTablero = ['0,0', '0,1', '0,2', '0,3', '1,0', '1,1', '1,2', '1,3', '2,0', '2,1', '2,2', '2,3', '3,0', '3,1', '3,2', '3,3'];
    let sumaDistancias = 0;

    for (let index = 0; index < tablero.length; index++) {
        let numero = tablero[index];
        let cordenadaCorrespondiente = cordenadasTablero[index]
        let cordenadaObjetivo = cordenadasObjetivo[numero]
        //console.log(`Numero: ${numero} ; Está en: ${cordenadaCorrespondiente} ; Vá en: ${cordenadaObjetivo}`);
        let distanciaX = Math.abs(Number(cordenadaCorrespondiente[0]) - Number(cordenadaObjetivo[0]));
        let distanciaY = Math.abs(Number(cordenadaCorrespondiente[2]) - Number(cordenadaObjetivo[2]));
        sumaDistancias += (distanciaX + distanciaY);
    }
    //console.log(`Heuristica: ${sumaDistancias}`);
    return sumaDistancias;

}




//MUEVE HACIA ALGUN LADO EL ESPACIO EN BLANCO TOMANDO EN CUENTA LAS MANESILLAS DEL RELOJ Y DEVUELVE EL MOVIMIENTO REALIZADO
function mover_cero(t, ya_realizados, mov_ant, direccion = null) { //mov_ant = Movimientos ya realizados en ese nivel de profunddida + movimiento del que vengo

    var index = t.indexOf("0");
    var mov_restantes = calcular_mov_restantes(index, ya_realizados, mov_ant);

    if (direccion === null) {
        if (mov_restantes.length === 0) {
            return 0;
        }
        if (mov_restantes.includes(6)) {
            var aux = t[index + 4];
            t[index + 4] = t[index];
            t[index] = aux;
            return 6;

        } else if (mov_restantes.includes(9)) {
            var aux = t[index - 1];
            t[index - 1] = t[index];
            t[index] = aux;
            return 9;
        } else if (mov_restantes.includes(12)) {
            var aux = t[index - 4];
            t[index - 4] = t[index];
            t[index] = aux;
            return 12;

        } else if (mov_restantes.includes(3)) {
            var aux = t[index + 1];
            t[index + 1] = t[index];
            t[index] = aux;
            return 3;

        }
    } else {
        switch (direccion) {
            case 12:
                var aux = t[index - 4];
                t[index - 4] = t[index];
                t[index] = aux;
                return 12;
            case 3:
                var aux = t[index + 1];
                t[index + 1] = t[index];
                t[index] = aux;
                return 3;
            case 6:
                var aux = t[index + 4];
                t[index + 4] = t[index];
                t[index] = aux;
                return 6;
            case 9:
                var aux = t[index - 1];
                t[index - 1] = t[index];
                t[index] = aux;
                return 9;
        }
    }

}

function regresar_cero(t, p_ant) {

    var index = t.indexOf("0");

    if (p_ant === -1) {
        return;
    } else if (p_ant === 12) {
        var aux = t[index + 4];
        t[index + 4] = "0";
        t[index] = aux;
    } else if (p_ant === 3) {
        var aux = t[index - 1];
        t[index - 1] = "0";
        t[index] = aux;
    } else if (p_ant === 6) {
        var aux = t[index - 4];
        t[index - 4] = "0";
        t[index] = aux;
    } else if (p_ant === 9) {
        var aux = t[index + 1];
        t[index + 1] = "0";
        t[index] = aux;
    }

}

function calcular_mov_restantes(p, movs_ya_realizados, mov_ant) { //INTRODUCIR POSISCION ACTUAL Y ULTIMO MOVIMIENTO
    //console.log("Movimientos ya hechos", movs_ya_realizados);
    var movs_restantes = [12, 3, 6, 9];

    for (let index = 0; index < movs_ya_realizados.length; index++) {
        movs_restantes.splice(movs_restantes.indexOf(movs_ya_realizados[index]), 1);
    }

    //console.log("Sin realizados ", movs_restantes);


    if (mov_ant === 12) {
        movs_restantes.splice(movs_restantes.indexOf(6), 1);

    } else if (mov_ant === 3) {
        movs_restantes.splice(movs_restantes.indexOf(9), 1);

    } else if (mov_ant === 6) {
        movs_restantes.splice(movs_restantes.indexOf(12), 1);

    } else if (mov_ant === 9) {
        movs_restantes.splice(movs_restantes.indexOf(3), 1);
    }
    //console.log("Sin anterior ", movs_restantes);

    if (p === 0) {
        movs_restantes.splice(movs_restantes.indexOf(12), 1);
        movs_restantes.splice(movs_restantes.indexOf(9), 1);
    } else if (p === 3) {
        movs_restantes.splice(movs_restantes.indexOf(12), 1);
        movs_restantes.splice(movs_restantes.indexOf(3), 1);
    } else if (p === 12) {
        movs_restantes.splice(movs_restantes.indexOf(9), 1);
        movs_restantes.splice(movs_restantes.indexOf(6), 1);
    } else if (p === 15) {
        movs_restantes.splice(movs_restantes.indexOf(6), 1);
        movs_restantes.splice(movs_restantes.indexOf(3), 1);
    } else if (p === 1 || p === 2) {
        movs_restantes.splice(movs_restantes.indexOf(12), 1);
    } else if (p === 4 || p === 8) {
        movs_restantes.splice(movs_restantes.indexOf(9), 1);
    } else if (p === 7 || p === 11) {
        movs_restantes.splice(movs_restantes.indexOf(3), 1);
    } else if (p === 13 || p === 14) {
        movs_restantes.splice(movs_restantes.indexOf(6), 1);
    }

    //console.log("Movimientos posibles: " + movs_restantes.toString() + "\n");
    return movs_restantes;
}

function revolver_tablero(t, cant) {
    var cont = 0;
    var anterior = -1;
    while (cont < cant) {
        var aux, i = t.indexOf("0");
        var movs_posibles = calcular_mov_restantes(i, [], anterior);
        var random = Math.floor(Math.random() * (4 - 0)) + 0;

        if (random === 0 && movs_posibles.includes(12)) {
            aux = t[i - 4];
            t[i] = aux;
            t[i - 4] = "0";
            cont++;
            anterior = 12;
            console.log("Arriba");
        } else if (random === 1 && movs_posibles.includes(3)) {
            aux = t[i + 1];
            t[i] = aux;
            t[i + 1] = "0";
            cont++;
            anterior = 3;
            console.log("Derecha");
        } else if (random === 2 && movs_posibles.includes(6)) {
            aux = t[i + 4];
            t[i] = aux;
            t[i + 4] = "0";
            cont++;
            anterior = 6;
            console.log("Abajo");
        } else if (random === 3 && movs_posibles.includes(9)) {
            aux = t[i - 1];
            t[i] = aux;
            t[i - 1] = "0";
            cont++;
            anterior = 9;
            console.log("Izquierda");
        }
    }
    /*
    t.forEach(element => {
        t2.push(element);
    });
    console.log(t2)
    */
    console.log(t);
}


console.log(`Original ${tablero}`);
revolver_tablero(tablero, 10);
var tableroReset = [...tablero];
console.log(`Nuevo ${tablero}`);
var COTA_ACTUAL = h1(tablero);
console.time("IDA");
while (MEJOR_SOLUCION.length === 0) {
    if (SIGUIENTES_COTAS.length != 0) {
        COTA_ACTUAL = SIGUIENTES_COTAS[0];
        console.log(`COTA AUMENTADA A > ${COTA_ACTUAL}`);
    }
    tablero = [...tableroReset];
    IDA(tablero, -1, 'h1');
}
console.timeEnd("IDA");


let sol = [];
for (let index = 0; index < MEJOR_SOLUCION.length; index++) {
    if (MEJOR_SOLUCION[index] === 3) {
        sol.push('Derecha')
    } else if (MEJOR_SOLUCION[index] === 6) {
        sol.push('Abajo')
    } else if (MEJOR_SOLUCION[index] === 9) {
        sol.push('Izquierda')
    } else if (MEJOR_SOLUCION[index] === 12) {
        sol.push('Arriba')
    }

}

console.log("La Mejor Solucion ", sol);
console.log("Nodos Visitados: " + NO_MOVIMIENTOS.toLocaleString('en-US'));
console.log("");


