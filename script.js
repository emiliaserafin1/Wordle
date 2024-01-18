const obtenerPalabraUrl = 'https://words.dev-apis.com/word-of-the-day'; 
const validarPalabraUrl = 'https://words.dev-apis.com/validate-word';

const letras = document.querySelectorAll('.letra');
const palabras = document.querySelectorAll('.palabra');

const palabrasArray = [[],[],[],[],[],[]]
let palabraDelDia = [];   
let palabraActual = ''
let posicionPalabra = 0;

console.log(palabraDelDia); 


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



obtenerPalabra().then((palabra) => palabra.split(''));

validarPalabra('idiot').then((valid) => {
    console.log('La palabra es válida:', valid);
})
    

function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
}

function escribirLetra(letra) {
    // Obtiene la tecla presionada
    const letraPresionada = letra.key.toUpperCase();

    // Si no es una letra, no hace nada
    if (!isLetter(letraPresionada)) {
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

function verificarPalabra(palabra) {
    if (palabra.length === 5){
        return true;
    }
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
        if (verificarPalabra(palabraActual)) {
            guardarPalabra();
            // Llama a la función actualizarPalabra con la palabraActual y la posición del div#palabra actual
            actualizarPalabra(palabraActual, posicionPalabra);
            palabraActual = '';

            // Encuentra la próxima posición vacía en palabrasArray
            posicionPalabra = palabrasArray.findIndex(subarray => subarray.length === 0);
        }
    }
    
    if (event.key === 'Backspace') {
        borrarUltimo();
    }
});

