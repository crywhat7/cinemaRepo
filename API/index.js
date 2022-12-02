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

app.listen(3000, () => {
  db.connect();
  console.log('Conectado a la base de datos');
  console.log('Example app listening on port 3000!'.bgGreen);
});
