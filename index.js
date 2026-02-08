// index.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';           // npm install helmet
import moviesRouter from './routes/movies.js';  // ← ¡extensión .js obligatoria!

// Cargar variables de entorno (instala dotenv si no lo tienes: npm install dotenv)
import 'dotenv/config';

const app = express();

// ─── Seguridad básica ───
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],   // permite los <style> inline
      imgSrc: ["'self'", 'data:'],               // por si agregas imágenes después
      connectSrc: ["'self'"],                    // para futuras peticiones fetch
    },
  })
);

// CORS controlado (usa .env en producción)
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:5173'];

app.use(cors({
  origin: (origin, callback) => {
    // Permitir requests sin origin (Postman, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origen no permitido por política CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Limitar tamaño de JSON (evita ataques de bombas grandes)
app.use(express.json({ limit: '300kb' }));
app.use(express.urlencoded({ extended: true, limit: '300kb' }));

// Logging mejorado
app.use((req, res, next) => {
  const hora = new Date().toLocaleString('es-MX', { timeZone: 'America/Chicago' });
  console.log(`[${hora}] ${req.method} ${req.url} ── ${req.headers.origin || 'sin-origin'}`);
  next();
});

// Rutas principales
app.use('/api/movies', moviesRouter);

// Rutas de desarrollo (puedes condicionarlas después)
app.get('/', (req, res) => {
  res.send(`
    <h1>¡Clase 3 - Servidor Express ESM listo! 🚀</h1>
    <p>Estamos usando ESM + seguridad básica.</p>
  `);
});

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>API Películas - Clase 3</title>
      <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f0f4f8; color: #333; }
        h1 { color: #2c3e50; }
        .btn { 
          display: inline-block; margin: 20px; padding: 12px 24px; 
          background: #3498db; color: white; text-decoration: none; 
          border-radius: 6px; font-size: 1.1em; transition: 0.3s; 
        }
        .btn:hover { background: #2980b9; transform: translateY(-2px); }
      </style>
    </head>
    <body>
      <h1>¡API de Películas Clase 3 corriendo! 🚀</h1>
      <p>Estamos usando ESM, Helmet y CORS controlado.</p>
      
      <a href="/api/saludo" class="btn">Probar GET /api/saludo (JSON)</a>
      <br>
      <a href="/api/movies" class="btn">Ver lista de películas (GET /api/movies)</a>
      
      <p style="margin-top: 40px; font-size: 0.9em; color: #777;">
        Usa Postman o curl para POST/PATCH. ¡Todo listo para Railway!
      </p>
    </body>
    </html>
  `);
});

// Error handler mejorado
app.use((err, req, res, next) => {
  console.error('ERROR:', err.stack || err.message);
  
  const status = err.status || 500;
  const message = status === 500 
    ? 'Error interno del servidor 💥' 
    : (err.message || 'Error desconocido');

  res.status(status).json({ error: message });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Entorno: ${process.env.NODE_ENV || 'development'}`);
});