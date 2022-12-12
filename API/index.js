const express = require('express');
const colors = require('colors');
const cors = require('cors');

const promise = require('bluebird');

const options = {
  promiseLib: promise,
};

const pgp = require('pg-promise')(options);

// db config
const dbConfig = {
  host: 'containers-us-west-135.railway.app',
  port: '6982',
  database: 'cinema',
  user: 'postgres',
  password: 'UBRp3a4uuT12OrHmDFYN',
};

const db = pgp(dbConfig);

const app = express();

const corsOptions = {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
  maxAge: 3600,
};

app.use(
  express.json({
    limit: '50mb',
  })
);

app.use(cors(corsOptions));
app.use(express.json());

const pgfunction = async (schema, funcion, pgParametros) => {
  // funcion y schema deven ser un string
  if (typeof funcion !== 'string' || typeof schema !== 'string') {
    throw new Error('El nombre de la función debe ser un string');
  }

  // pgParametros deve ser un array
  if (!Array.isArray(pgParametros)) {
    throw new Error('El parámetro pgParametros debe ser un array');
  }

  try {
    return (await db.func(`${schema}.${funcion}`, pgParametros))[0][funcion];
  } catch (error) {
    throw new Error(error);
  }
};

// Zona Providers

getRandomMovie = async () => {
  return pgfunction('public', 'get_random_movie', []);
};

getBestMovies = async () => {
  return pgfunction('public', 'get_best_movies', []);
};

getTerrorMovies = async () => {
  return pgfunction('public', 'get_terror_movies', []);
};

getInfoMovue = async (id) => {
  return pgfunction('public', 'get_info_movie', [id]);
};

getDramaMovies = async () => {
  return pgfunction('public', 'get_drama_movies', []);
};

getAllMovies = async () => {
  return pgfunction('public', 'get_all_movies_name', []);
};

getMovieCharts = async (id) => {
  return pgfunction('public', 'get_movie_charts', [id]);
};

getPaises = async (id) => {
  return pgfunction('public', 'get_paises', []);
};

postRegistrarVenta = async (venta) => {
  const { idPais, idPelicula, cantidadAsientos, precio, total } = venta;
  return pgfunction('public', 'registrar_venta', [
    cantidadAsientos,
    idPais,
    idPelicula,
    precio,
    total,
  ]);
};

app.get('/', (_req, res) => {
  res.json({ Hello: 'World' });
});

app.get('/random-movie', (_req, res) => {
  try {
    getRandomMovie().then((data, err) => {
      if (err) {
        res.json({ error: 'Error al obtener la pelicula' });
      }
      res.json(data);
    });
  } catch (error) {}
});

app.get('/all-movies', (_req, res) => {
  try {
    getAllMovies().then((data, err) => {
      if (err) {
        res.json({ error: 'Error al obtener las pelicula' });
      }
      res.json(data);
    });
  } catch (error) {}
});

app.get('/best-movies', (_req, res) => {
  try {
    getBestMovies().then((data, err) => {
      if (err) {
        res.json({ error: 'Error al obtener la pelicula' });
      }
      res.json(data);
    });
  } catch (error) {}
});

app.get('/terror-movies', (_req, res) => {
  try {
    getTerrorMovies().then((data, err) => {
      if (err) {
        res.json({ error: 'Error al obtener la pelicula' });
      }
      res.json(data);
    });
  } catch (error) {}
});

app.get('/movie/:id', (req, res) => {
  try {
    getInfoMovue(req.params.id).then((data, err) => {
      if (err) {
        res.json({ error: 'Error al obtener la pelicula' });
      }
      res.json(data);
    });
  } catch (error) {}
});

app.get('/movie-charts/:id', (req, res) => {
  try {
    getMovieCharts(req.params.id).then((data, err) => {
      if (err) {
        res.json({ error: 'Error al obtener la pelicula' });
      }
      res.json(data);
    });
  } catch (error) {}
});

app.get('/drama-movies', (_req, res) => {
  try {
    getDramaMovies().then((data, err) => {
      if (err) {
        res.json({ error: 'Error al obtener la pelicula' });
      }
      res.json(data);
    });
  } catch (error) {}
});

app.get('/paises', (_req, res) => {
  try {
    getPaises().then((data, err) => {
      if (err) {
        res.json({ error: 'Error al obtener la pelicula' });
      }
      res.json(data);
    });
  } catch (error) {
    console.log(error);
  }
});

app.post('/registrar-venta', (req, res) => {
  try {
    let { venta } = req.query;
    venta = JSON.parse(venta);
    postRegistrarVenta(venta).then((data, err) => {
      if (err) {
        res.json({ error: 'Error al obtener la pelicula' });
      }
      res.json(data);
    });
  } catch (error) {
    console.log(error);
  }
});

// enviroment port or 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.clear();
  try {
    db.connect();
    console.log('Conectado a la base de datos');
  } catch (error) {
    console.log('No se pudo conectar a la base de datos.');
  }
  console.log(`Example app listening on port ${port}!`.white.bold.bgGreen);
});
