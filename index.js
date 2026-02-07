// index.js - Servidor base para Clase 3 (Express + preparación para CORS)

const express = require('express');
const cors = require('cors');          // lo instalamos para CORS
const app = express();

// Middleware global: permite CORS (lo activaremos en breve)
app.use(cors());                       // por ahora permite todo (para pruebas)

// Middleware incorporado: procesa JSON en el body de POST/PUT
app.use(express.json());

// Middleware de logging (muy útil para ver qué llega)
app.use((req, res, next) => {
  const hora = new Date().toLocaleString('es-MX', { timeZone: 'America/Chicago' });
  console.log(`[${hora}] ${req.method} ${req.url} - Origen: ${req.headers.origin || 'local'}`);
  next(); // pasa al siguiente middleware
});

// Importa el router de películas
const moviesRouter = require('./routes/movies');

// Monta las rutas en /api/movies
app.use('/api/movies', moviesRouter);

// Ruta de prueba básica (raíz)
app.get('/', (req, res) => {
  res.send(`
    <h1>¡Clase 3 - Servidor Express listo! 🚀</h1>
    <p>Estamos preparando CORS y middlewares avanzados.</p>
    <p>Prueba: <a href="/api/saludo">/api/saludo</a></p>
  `);
});

// Ruta de ejemplo para probar JSON
app.get('/api/saludo', (req, res) => {
  res.json({
    mensaje: '¡Hola desde la Clase 3!',
    fecha: new Date().toLocaleString(),
    desde: 'San Antonio, Texas 😄'
  });
});

// Middleware 404 - al final de todas las rutas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada 🙅‍♂️' });
});

// Middleware de errores - último de todos
app.use((err, req, res, next) => {
  console.error('Error capturado:', err.message);
  res.status(500).json({ error: 'Algo salió mal en el servidor 💥' });
});

// Puerto dinámico (funciona local y en producción)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor de Clase 3 corriendo en http://localhost:${PORT}`);
  console.log('Ctrl + C para detener');
});