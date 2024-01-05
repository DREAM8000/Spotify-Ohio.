// Función para cargar canciones desde YouTube
async function cargarCancionesYouTube(query) {
    const apiKey = 'AIzaSyCCCE6FrUPRlFGh0B49xpgUcEIJSosSFMw'; // Reemplaza con tu propia clave de API
    const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${apiKey}&type=video&videoLicense=creativeCommon`;

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Extraer información relevante de los resultados (títulos y video IDs)
        const canciones = data.items.map(item => ({
            titulo: item.snippet.title,
            videoId: item.id.videoId
        }));

        return canciones;
    } catch (error) {
        console.error('Error al buscar canciones:', error.message);
        return [];
    }
}

// Función para reproducir la canción de YouTube en el reproductor
function reproducirCancionYouTube(videoId) {
    const reproductorContainer = document.getElementById('reproductor-container');
    reproductorContainer.innerHTML = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}?enablejsapi=1" frameborder="0" allowfullscreen></iframe>`;

    // Mostrar el menú de reproducción
    document.getElementById('reproductor-menu').classList.remove('oculto');
}

// Función para reproducir la canción en el menú
function reproducirCancion() {
    const reproductorIframe = document.querySelector('#reproductor-container iframe');
    reproductorIframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
}

// Función para pausar la canción en el menú
function pausarCancion() {
    const reproductorIframe = document.querySelector('#reproductor-container iframe');
    reproductorIframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
}

// Función para buscar canciones desde YouTube
async function buscarCanciones() {
    const query = document.getElementById('busqueda-input').value;
    const canciones = await cargarCancionesYouTube(query);
    mostrarResultadosBusqueda(canciones);
}

// Función para mostrar los resultados de búsqueda
function mostrarResultadosBusqueda(resultados) {
    const listaElement = document.getElementById('busqueda-lista');
    listaElement.innerHTML = ''; // Limpiar la lista actual

    resultados.forEach(cancion => {
        const li = document.createElement('li');
        li.textContent = cancion.titulo;
        li.addEventListener('click', () => reproducirCancionYouTube(cancion.videoId)); // Agrega evento de clic
        listaElement.appendChild(li);
    });
}

// Función para agregar canciones a la lista
function agregarCancionesALista(seccionId, canciones) {
    const listaElement = document.getElementById(`${seccionId}-lista`);
    listaElement.innerHTML = ''; // Limpiar la lista actual

    canciones.forEach(cancion => {
        const li = document.createElement('li');
        li.textContent = cancion.titulo;
        li.addEventListener('click', () => reproducirCancionYouTube(cancion.videoId)); // Agrega evento de clic
        listaElement.appendChild(li);
    });
}

// Evento al cargar la página
document.addEventListener('DOMContentLoaded', async function() {
    // Cargar y mostrar canciones en sección "Populares"
    await cargarYMostrarCanciones('populares', 'Música popular');

    // Cargar y mostrar canciones en sección "Rock"
    await cargarYMostrarCanciones('rock', 'Rock');
});

// Resto del código existente...