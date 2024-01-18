const obtenerPalabraUrl = 'https://words.dev-apis.com/word-of-the-day'; 
const validarPalabraUrl = 'https://words.dev-apis.com/validate-word';
const letras = document.querySelectorAll('.letra');
const palabras = document.querySelectorAll('.palabra');
const palabrasArray = [[],[],[],[],[],[]]
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
    // Busca el último div con contenido
    const ultimoDiv = Array.from(letras).reverse().find(div => div.textContent);
    // Si hay un div con contenido, lo borra
    if (ultimoDiv) {
        const ultimaPosicion = palabraActual.lastIndexOf(ultimoDiv.textContent);
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
            guardarPalabra();
            palabraActual = '';
        }
    }
    
    if (event.key === 'Backspace') {
        borrarUltimo();
    }
});

