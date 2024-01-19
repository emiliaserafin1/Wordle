const obtenerPalabraUrl = 'https://words.dev-apis.com/word-of-the-day'; 
const validarPalabraUrl = 'https://words.dev-apis.com/validate-word';

const letras = document.querySelectorAll('.letra');
const palabras = document.querySelectorAll('.palabra');

const palabrasArray = [[],[],[],[],[],[]] 
let palabraDelDia = '';
let palabraActual = ''
let posicionPalabra = 0;
let ganaste = false;


// Solicitudes a la API

async function obtenerPalabra() {
    const promise = await fetch(obtenerPalabraUrl);
    const data = await promise.json();
    const palabraDelDia = data.word;
    return palabraDelDia;
}

async function validarPalabra(palabra) {
    const promise = await fetch(validarPalabraUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            word: palabra,
        }),
    })
    const data = await promise.json();
    return data.validWord;
}
   

function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
}

function escribirLetra(letra) {
    // Obtiene la tecla presionada
    const letraPresionada = letra.key.toUpperCase();

    // Si no es una letra o ya gano, no hace nada
    if (!isLetter(letraPresionada) || ganaste) {
        return;
    }

    if (palabraActual.length < 5) {
        // Busca el primer div sin contenido
        const primerDivVacio = Array.from(letras).find(div => !div.textContent);

        // Si hay un div vacío, asigna la letra a ese div
        if (primerDivVacio) {
            primerDivVacio.textContent = letraPresionada;
            palabraActual += letra.key.toUpperCase();
        }
    } 
}

function guardarPalabra(){
    // Si ya llegó a 5 letras, guarda la palabra en el array correspondiente
    if (palabraActual.length === 5){
        const index = palabrasArray.findIndex(subarray => subarray.length === 0);
        console.log(index);
        if (index !== -1) {
            palabrasArray[index] = [...palabraActual];
        }
        console.log(palabrasArray);
    }
}

function resetearPalabraActual() {
    palabraActual = '';
}

function verificarLongitud(palabra) {
    if (palabra.length === 5){
        return true;
    }
}

function checkearPalabra(palabra, posicion) {
    obtenerPalabra().then((palabraDelDia) => {
        palabraDelDia = palabraDelDia.toUpperCase();
        let palabraDelDiaAux = palabraDelDia;
        const letrasPalabra = document.querySelectorAll(`#palabra-${posicion} .letra`);
        console.log(palabra);

        if (palabra === palabraDelDia) {
            ganaste = true;
            alert('¡Ganaste!');
            for (let i = 0; i < palabra.length; i++) {
                letrasPalabra[i].classList.add('acierto');
            }
        } else {
            for (let i = 0; i < palabra.length; i++) {
                console.log('Letra ingresada ' + palabra[i], 'Letra correcta ' + palabraDelDia[i]);

                if (palabra[i] === palabraDelDia[i]) {
                    letrasPalabra[i].classList.add('acierto');
                    palabraDelDiaAux = palabraDelDiaAux.replace(palabra[i], ''); // Remover letra correcta
                    console.log('acierto');
                } else if (palabraDelDia.includes(palabra[i])) {
                    letrasPalabra[i].classList.add('casiAcierto');
                    palabraCorrecta = false;
                } else {
                    letrasPalabra[i].classList.add('fallo');
                    palabraCorrecta = false;
                }
            }
        }
    });
}



function borrarUltimo() {
    if (palabraActual.length === 0) {
        return;
    }

    // Obtiene el último carácter de la palabra actual
    const ultimoCaracter = palabraActual.charAt(palabraActual.length - 1);

    // Busca el último div donde se escribió ese carácter
    const ultimoDiv = Array.from(letras).reverse().find(div => div.textContent === ultimoCaracter);

    // Si hay un div con el último carácter, lo borra
    if (ultimoDiv) {
        ultimoDiv.textContent = '';

        // Actualiza la palabra actual eliminando el último carácter
        palabraActual = palabraActual.slice(0, -1);
    }
}


function actualizarPalabra(palabra, posicion) {
    // Verifica que la palabra tenga exactamente 5 letras
    if (palabra.length < 5) {
        return;
    }

    // Actualiza solo las letras dentro del div#palabra correspondiente
    const letrasPalabra = document.querySelectorAll(`#palabra-${posicion} .letra`);
    letrasPalabra.forEach((letra, index) => {
        letra.textContent = palabra[index] || ''; // Asigna la letra correspondiente o cadena vacía si no hay letra
    });
}

document.addEventListener('keyup', (event) => {
    escribirLetra(event);
    if (event.key === 'Enter') {
        if (verificarLongitud(palabraActual)) {
            checkearPalabra(palabraActual, posicionPalabra);
            guardarPalabra();
            // Llama a la función actualizarPalabra con la palabraActual y la posición del div#palabra actual
            actualizarPalabra(palabraActual, posicionPalabra);
            resetearPalabraActual();
            // Encuentra la próxima posición vacía en palabrasArray
            posicionPalabra = palabrasArray.findIndex(subarray => subarray.length === 0);
        }
    }
    
    if (event.key === 'Backspace') {
        borrarUltimo();
    }
});

