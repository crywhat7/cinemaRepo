const d = (e) => {
  return document.querySelector(e);
};

const dAll = (e) => {
  return document.querySelectorAll(e);
};

let x;
const $card = $('.main__estadisticas__graficas');
const $style = $('.hover');

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
    console.log(
      'Soy M desarrollador casi-profesional que curse Programación IV y si Osman lee esto, que sepa que a pesar de que me tiene muy enojado por unos temas que no voy a mencionar y de seguro, él conoce, estoy dispuesto a tratarlo sin problema: +504 8828-5038'
    );
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

// !-----------------------------------
// No tocar porque no conozco el codigo
// Funcion para que el card sea belleza
// !-----------------------------------

$card
  .on('mousemove touchmove', function (e) {
    // normalise touch/mouse
    var pos = [e.offsetX, e.offsetY];
    e.preventDefault();
    if (e.type === 'touchmove') {
      pos = [e.touches[0].clientX, e.touches[0].clientY];
    }
    var $card = $(this);
    // math for mouse position
    var l = pos[0];
    var t = pos[1];
    var h = $card.height();
    var w = $card.width();
    var px = Math.abs(Math.floor((100 / w) * l) - 100);
    var py = Math.abs(Math.floor((100 / h) * t) - 100);
    var pa = 50 - px + (50 - py);
    // math for gradient / background positions
    var lp = 50 + (px - 50) / 1.5;
    var tp = 50 + (py - 50) / 1.5;
    var px_spark = 50 + (px - 50) / 7;
    var py_spark = 50 + (py - 50) / 7;
    var p_opc = 20 + Math.abs(pa) * 1.5;
    var ty = ((tp - 50) / 2) * -1;
    var tx = ((lp - 50) / 1.5) * 0.5;
    // css to apply for active card
    var grad_pos = `background-position: ${lp}% ${tp}%;`;
    var sprk_pos = `background-position: ${px_spark}% ${py_spark}%;`;
    var opc = `opacity: ${p_opc / 100};`;
    var tf = `transform: rotateX(${ty}deg) rotateY(${tx}deg)`;
    // need to use a <style> tag for psuedo elements
    var style = `
      .main__estadisticas__graficas:hover:before { ${grad_pos} }  /* gradient */
      .main__estadisticas__graficas:hover:after { ${sprk_pos} ${opc} }   /* sparkles */
    `;
    // set / apply css class and style
    $card.removeClass('active');
    $card.removeClass('animated');
    $card.attr('style', tf);
    $style.html(style);
    if (e.type === 'touchmove') {
      return false;
    }
    clearTimeout(x);
  })
  .on('mouseout touchend touchcancel', function () {
    // remove css, apply custom animation on end
    var $card = $(this);
    $style.html('');
    $card.removeAttr('style');
    x = setTimeout(function () {
      $card.addClass('animated');
    }, 2500);
  });
