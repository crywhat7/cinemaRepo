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

const url = 'https://cinemarepo-production.up.railway.app';
// const url = 'http://localhost:3000';

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
      <option value="${e.idPelicula}" onclick="getEstadisticasByMovie(${e.idPelicula})">${e.nombrePelicula}</option>
      `;
    });

    d('.select-movies').innerHTML = html;

    d('.select-movies').addEventListener('change', (e) => {
      getEstadisticasByMovie(e.target.value);
    });
  };
}

function getEstadisticasByMovie(idPelicula) {
  // getDatosPelicula
  console.log('idPelicula', idPelicula);
  const request = new XMLHttpRequest();
  request.open('GET', `${url}/movie-charts/${idPelicula}`);
  request.send();

  request.onload = () => {
    const movieCharts = JSON.parse(request.response);
    console.log('movieCharts', movieCharts);
    pintarEstadisticas(movieCharts);
  };
}

function pintarEstadisticas(estadisticas) {
  const elemento = d('.main__estadisticas__graficas');
  // Hora random entre las 9 y las 23
  const horaRandom = Math.floor(Math.random() * (23 - 9) + 9);

  let html = '';
  html = `
    <div class="main__estadisticas__graficas__titulo">
        ${estadisticas.infoMovie.nombrePelicula ?? 'ERROR'}
    </div>
    <div class="main__estadisticas__graficas__imagen">
      <img src="${estadisticas.infoMovie.imagen ?? 'error'}" alt="${
    estadisticas.infoMovie.nombrePelicula ?? 'ERROR'
  }" style="max-width: 15rem; border-radius:1rem;" />
    </div>
    <div class="main__estadisticas__graficas__resultados">
      <div class="pelicula">
        El ${
          estadisticas.charts.visualizacion ?? '0'
        }% de los usuarios vieron esta pelicula
      </div>
      <div class="horario">
        El ${
          estadisticas.charts.visualizacion * 0.65
        }% de los usuarios vieron esta pelicula a las ${
    estadisticas.charts.visualizacion ? horaRandom : '0'
  } horas
      </div>
      <div class="ciudad">
        El ${
          estadisticas.charts.visualizacion * 0.86 ?? '0'
        }% de los usuarios vieron esta pelicula en ${
    estadisticas.charts.paisConMasVistas ?? '...'
  }
      </div>
    </div>
        `;
  elemento.innerHTML = html;
}

getAllMovies();
