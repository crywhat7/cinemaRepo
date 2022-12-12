const d = (e) => {
  return document.querySelector(e);
};

const dAll = (e) => {
  return document.querySelectorAll(e);
};

// Botones del menu
const btnHome = d('.home-btn').addEventListener('click', () => {
  window.location.href = 'home.html';
});

const chartBtn = d('.chart-btn').addEventListener('click', () => {
  window.location.href = 'estadisticas.html';
});

const btnConfig = d('.config-btn').addEventListener('click', () => {
  // Ir al archivo configuracion.html
  window.location.href = 'configuracion.html';
});

const cardPelicula = dAll();

let butacas = new Array(80).fill(true);

// const url = 'https://cinemarepo-production.up.railway.app';
const url = 'http://localhost:3000';

function getAllMovies() {
  const request = new XMLHttpRequest();
  request.open('GET', `${url}/best-movies`);
  request.send();

  request.onload = () => {
    const response = request.response;
    let movies = JSON.parse(response);
    let html = '';
    movies = movies.sort((a, b) => {
      return b.nombrePelicula - a.nombrePelicula;
    });
    movies.forEach((e) => {
      html += `
      <option onclick="getEstadisticasByMovie(${e.idPelicula})">${e.nombrePelicula}</option>
      `;
    });

    d('.select-movies').innerHTML = html;
  };
}

function getEstadisticasByMovie(idPelicula) {
  // getDatosPelicula
  const request = new XMLHttpRequest();
  request.open('GET', `${url}/movie-charts/${idPelicula}`);
  request.send();

  request.onload = () => {
    const movieCharts = JSON.parse(request.response);
    console.log('movieCharts', movieCharts);
  };
}

getAllMovies();
