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

const btnConfig = d('.config-btn').addEventListener('click', () => {
  // Ir al archivo configuracion.html
  window.location.href = 'configuracion.html';
});

const cardPelicula = dAll();

let butacas = new Array(80).fill(true);

const url = 'https://cinemarepo-production.up.railway.app';

function getRandomMovie() {
  const request = new XMLHttpRequest();
  request.open('GET', `${url}/random-movie`);
  request.send();

  request.onload = () => {
    const response = request.response;
    const movie = JSON.parse(response);
    d('.pelicula-principal').innerHTML = `
      <img
            src="${movie.imagen ?? 'https://via.placeholder.com/300x450'}"
            alt="pelicula"
            class="pelicula-principal__imagen"
            onclick="comprarPelicula(${movie.idPelicula})"
            />
          <div class="texto">
            <span class="titulo"> ${movie.nombrePelicula ?? 'ERROR'} </span>
            <span class="generos"> ${movie.genero ?? 'ERROR'} </span>
          </div>
          `;
  };
}

function getBestMovies() {
  const request = new XMLHttpRequest();
  request.open('GET', `${url}/best-movies`);
  request.send();

  request.onload = () => {
    const response = request.response;
    const movies = JSON.parse(response);
    let html = '';
    movies.forEach((e) => {
      html += `
      <span class="mejores-actores__cartelera__card" onclick="comprarPelicula(${
        e.idPelicula
      })">
      <img
        src="${e.imagen ?? 'https://via.placeholder.com/300x450'}"
        alt="pelicula" />
      <div class="texto">
        <span class="titulo"> ${e.nombrePelicula} </span>
      </div>
    </span>
      `;
    });

    d('.mejores-actores__cartelera').innerHTML = html;
  };
}

function getTerrorMovies() {
  const request = new XMLHttpRequest();
  request.open('GET', `${url}/terror-movies`);
  request.send();

  request.onload = () => {
    const response = request.response;
    const movies = JSON.parse(response);
    let html = '';
    movies.forEach((e) => {
      html += `
      <span class="terror__cartelera__card" onclick="comprarPelicula(${
        e.idPelicula
      })">
      <img
        src="${e.imagen ?? 'https://via.placeholder.com/300x450'}"
        alt="pelicula" />
      <div class="texto">
        <span class="titulo"> ${e.nombrePelicula} </span>
      </div>
    </span>
      `;
    });

    d('.terror__cartelera').innerHTML = html;
  };
}

function getDramaMovies() {
  const request = new XMLHttpRequest();
  request.open('GET', `${url}/drama-movies`);
  request.send();

  request.onload = () => {
    const response = request.response;
    const movies = JSON.parse(response);
    let html = '';
    movies.forEach((e) => {
      html += `
      <span class="drama__cartelera__card" onclick="comprarPelicula(${
        e.idPelicula
      })">
      <img
        src="${e.imagen ?? 'https://via.placeholder.com/300x450'}"
        alt="pelicula" />
      <div class="texto">
        <span class="titulo"> ${e.nombrePelicula} </span>
      </div>
    </span>
      `;
    });

    d('.drama__cartelera').innerHTML = html;
  };
}

function comprarPelicula(idPelicula) {
  const verPelicula = d('.main__pelicula-ver');
  // getDatosPelicula
  const request = new XMLHttpRequest();
  request.open('GET', `${url}/movie/${idPelicula}`);
  request.send();

  request.onload = () => {
    const movie = JSON.parse(request.response);
    // Session Storage
    sessionStorage.setItem('movie', JSON.stringify(movie));
    verPelicula.innerHTML = `
      <div class="pelicula-ver__info">
      <h3>Comprar boleto</h3>
        <div class="pelicula-ver__info__poster">
          <img
            src="${movie.imagen}"
            alt="Pelicula" />
        </div>
        <div class="pelicula-ver__info__datos">
          <span class="pelicula-ver__info__datos__titulo">${movie.nombrePelicula}</span>
        </div>
        <div class="pelicula-ver__comprar">
          <button class="pelicula-ver__comprar__btn">COMPRAR</button>
        </div>
      </div>
    `;
  };
  setTimeout(() => {
    const btnComprar = document.querySelector('.pelicula-ver__comprar__btn');

    btnComprar.addEventListener('click', () => {
      const modal = d('.modal-butaca');
      modal.classList.add('visible');
      manejarModal();
    });
  }, 2000);

  d('.close').addEventListener('click', () => {
    const modal = d('.modal-butaca');
    modal.classList.remove('visible');
  });
}

function manejarModal() {
  butacas = [];
  if (butacas.length === 0) {
    butacas = new Array(80).fill(true);
  }
  const espacioButacas = d('.espacio-butacas');
  espacioButacas.innerHTML = '';

  butacas.forEach((e) => {
    espacioButacas.innerHTML += `
    <span class="butaca ${!e ? 'seleccionada' : ''}">
      <img src="./images/butaca.png" alt="butaquita">
    </span>
    `;
  });

  setTimeout(() => {
    calcularTotal();
  }, 2000);

  const butaquitas = dAll('.butaca');
  butaquitas.forEach((e) => {
    e.addEventListener('click', () => {
      e.classList.toggle('seleccionada');
      calcularTotal();
    });
  });
  const btnPagar = d('.pago-boletos__boton');
  btnPagar.addEventListener('click', () => {
    const modal = d('.modal-factura');
    modal.classList.add('factura-visible');
    manejarModalPago();
  });
}

function manejarModalPago() {
  const modal = d('.modal-butaca');
  modal.classList.remove('visible');
  const butacasCompradas = [];
  document.querySelectorAll('.butaca').forEach((e, i) => {
    if (e.classList.contains('seleccionada')) {
      butacasCompradas.push(i);
    }
  });

  const total = butacasCompradas.length * 50;
  const pelicula = JSON.parse(sessionStorage.getItem('movie')).nombrePelicula;

  document.querySelector('.factura').innerHTML = `
  <span class="factura__titulo"> <b>Factura</b></span>
    <br>
    <br>
    <span class="factura__pelicula">Pelicula: ${pelicula.toUpperCase()}</span>
    <br>
    <span class="factura__butacas">Butacas: ${
      butacasCompradas.length
    } * 50 Lps</span>
    <br>
  <span class="factura__total">Total: <b>${total} Lps</b></span>
  `;

  setTimeout(() => {
    const modal = d('.modal-factura');
    modal.classList.remove('factura-visible');
  }, 5000);
}

function calcularTotal() {
  const total = d('.pago-boletos__total');

  let butacasSeleccionadas = [];

  document.querySelectorAll('.butaca').forEach((e, i) => {
    if (e.classList.contains('seleccionada')) {
      butacasSeleccionadas.push(`Silla #CH${i + 1} => 50Lps`);
    }
  });

  butacasSeleccionadas = butacasSeleccionadas.filter((e) => e);

  total.innerHTML = '';

  butacasSeleccionadas.forEach((e) => {
    total.innerHTML += `${e}<br/>`;
  });
  total.innerHTML += `Total: <b>${butacasSeleccionadas.length * 50}</b> Lps`;
}

getRandomMovie();
getBestMovies();
getTerrorMovies();
getDramaMovies();
