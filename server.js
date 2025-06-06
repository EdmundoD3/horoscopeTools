import express, { json } from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { initializeDB, router } from './scripts/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(json());
app.use(express.static(join(__dirname, 'public')));

app.use('/shared', express.static(join(__dirname, 'shared')));
// Rutas API
app.use('/api', router);
app.get('/manage', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'manage.html'));
});
// Iniciar servidor
initializeDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
});