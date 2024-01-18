const obtenerPalabraUrl = 'https://words.dev-apis.com/word-of-the-day'; 
const validarPalabraUrl = 'https://words.dev-apis.com/validate-word';
const letras = document.querySelectorAll('.letra');
const palabras = [[],[],[],[],[],[]]
let palabraActual = ''



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

obtenerPalabra().then(palabra => {
    console.log(palabra);
});

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

        // Si ya llego a 5 letras, guarda la palabra
        if (palabraActual.length === 5){
            palabras.push(palabraActual);
        }
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
    // Busca el último div con contenido
    const ultimoDiv = Array.from(letras).reverse().find(div => div.textContent);
    // Si hay un div con contenido, lo borra
    if (ultimoDiv) {
        console.log(ultimoDiv.textContent);
        console.log(palabraActual);
        const ultimaPosicion = palabraActual.lastIndexOf(ultimoDiv.textContent);
        console.log(ultimaPosicion);
        palabraActual = palabraActual.substring(0, ultimaPosicion) ;
        console.log(`Palabra actual: ${palabraActual}`)
        actualizarPalabra();
    }
}

function actualizarPalabra() {
    // Actualiza cada div de letra con el contenido correspondiente de la palabraActual
    letras.forEach((letra, index) => {   
        letra.textContent = palabraActual[index] || ''; // Asigna la letra correspondiente o cadena vacía si no hay letra
    });
}


document.addEventListener('keyup', (event) => {
    escribirLetra(event);
    if (event.key === 'Enter') {
        if (verificarPalabra(palabraActual)) {
            console.log(palabras);
            palabraActual = '';
        }
    }
    
    if (event.key === 'Backspace') {
        borrarUltimo();
    }
});

