// routes/movies.js
const express = require('express');
const router = express.Router();

// Películas de ejemplo (base de datos en memoria)
let movies = [
  { id: 1, titulo: "Inception", año: 2010, director: "Christopher Nolan", genero: "Ciencia ficción" },
  { id: 2, titulo: "The Matrix", año: 1999, director: "Wachowski", genero: "Acción / Ciencia ficción" },
  { id: 3, titulo: "Interstellar", año: 2014, director: "Christopher Nolan", genero: "Ciencia ficción / Drama" }
];

// GET /movies → Lista todas las películas
router.get('/', (req, res) => {
  res.json(movies);
});

// GET /movies/:id → Obtiene una película por ID
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const movie = movies.find(m => m.id === id);

  if (!movie) {
    return res.status(404).json({ error: 'Película no encontrada' });
  }

  res.json(movie);
});

// POST /movies → Crea una nueva película con validaciones
router.post('/', (req, res) => {
  const { titulo, director, año, genero } = req.body;

  const errores = [];

  if (!titulo || typeof titulo !== 'string' || titulo.trim().length < 3) {
    errores.push('El título es obligatorio y debe tener al menos 3 caracteres');
  }

  if (!director || typeof director !== 'string' || director.trim().length < 3) {
    errores.push('El director es obligatorio y debe tener al menos 3 caracteres');
  }

  if (año && (typeof año !== 'number' || año < 1888 || año > new Date().getFullYear() + 5)) {
    errores.push('El año debe ser un número válido (entre 1888 y el año actual +5)');
  }

  if (genero && typeof genero !== 'string') {
    errores.push('El género debe ser texto');
  }

  if (errores.length > 0) {
    return res.status(400).json({
      error: 'Validación fallida',
      detalles: errores
    });
  }

  const nuevaPelicula = {
    id: movies.length + 1,
    titulo: titulo.trim(),
    director: director.trim(),
    año: año || null,
    genero: genero || 'Sin género especificado'
  };

  movies.push(nuevaPelicula);
  console.log('Nueva película creada:', nuevaPelicula);

  res.status(201).json(nuevaPelicula);
});

// PATCH /movies/:id → Actualiza película parcialmente
router.patch('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const movieIndex = movies.findIndex(m => m.id === id);

  if (movieIndex === -1) {
    return res.status(404).json({ error: 'Película no encontrada' });
  }

  const movie = movies[movieIndex];  // ← esta línea es importante

  // Protección contra req.body undefined o no objeto
  const body = req.body || {};
  const { titulo, director, año, genero } = body;

  const errores = [];

  if (titulo !== undefined) {
    if (typeof titulo !== 'string' || titulo.trim().length < 3) {
      errores.push('El título debe tener al menos 3 caracteres');
    } else {
      movie.titulo = titulo.trim();
    }
  }

  if (director !== undefined) {
    if (typeof director !== 'string' || director.trim().length < 3) {
      errores.push('El director debe tener al menos 3 caracteres');
    } else {
      movie.director = director.trim();
    }
  }

  if (año !== undefined) {
    if (typeof año !== 'number' || año < 1888 || año > new Date().getFullYear() + 5) {
      errores.push('El año debe ser un número válido (entre 1888 y el año actual +5)');
    } else {
      movie.año = año;
    }
  }

  if (genero !== undefined) {
    if (typeof genero !== 'string') {
      errores.push('El género debe ser texto');
    } else {
      movie.genero = genero.trim() || 'Sin género especificado';
    }
  }

  if (errores.length > 0) {
    return res.status(400).json({
      error: 'Validación fallida en actualización parcial',
      detalles: errores
    });
  }

  if (Object.keys(body).length === 0) {
    return res.status(400).json({ error: 'Debes enviar al menos un campo para actualizar' });
  }

  console.log(`Película actualizada (PATCH): ID ${id}`, movie);

  res.json(movie);  // Devolvemos la película actualizada
});

module.exports = router;