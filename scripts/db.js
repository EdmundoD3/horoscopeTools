// Adaptación completa de la herramienta para entradas con theme, title y content separados
import { Router } from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { validFrequencies, validLanguages, validSigns, validThemes } from '../shared/constants.js';
import { HoroscopeEntry } from '../shared/models/horoscopoEntry.js';
const router = Router();
let db;

async function initializeDB() {
  db = await open({
    filename: './horoscope.db',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS horoscope_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sign TEXT CHECK(sign IN ('${validSigns.join("','")}')) NOT NULL,
      type TEXT CHECK(type IN ('${validFrequencies.join("','")}')) NOT NULL,
      lang TEXT CHECK(lang IN ('${validLanguages.join("','")}')) NOT NULL,
      theme TEXT CHECK(theme IN ('${validThemes.join("','")}')) NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      lastSend TEXT,
      createdAt TEXT DEFAULT (datetime('now'))
    );
  `);
}

function validateBaseEntry(data) {
  const { sign, type, lang, theme } = data;
  if (!validSigns.includes(sign)) throw new Error(`Signo inválido: ${sign}`);
  if (!validFrequencies.includes(type)) throw new Error(`Frecuencia inválida: ${type}`);
  if (!validLanguages.includes(lang)) throw new Error(`Idioma inválido: ${lang}`);
  if (!validThemes.includes(theme)) throw new Error(`Tema inválido: ${theme}`);
}

function validateBulkEntry(entry) {
  if (!entry.title || typeof entry.title !== 'string') throw new Error('Título inválido');
  if (!entry.content || typeof entry.content !== 'string') throw new Error('Contenido inválido');
}

// Crear múltiples entradas (bulk)
router.post('/entries/bulk', async (req, res) => {
  try {
    const { sign, type, lang, theme, entries } = req.body;
    if (!Array.isArray(entries) || entries.length === 0) throw new Error('Debe incluirse un arreglo de entradas');

    validateBaseEntry({ sign, type, lang, theme });

    const stmt = await db.prepare(`
      INSERT INTO horoscope_entries (sign, type, lang, theme, title, content)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    for (const entry of entries) {
      validateBulkEntry(entry);
      await stmt.run(sign, type, lang, theme, entry.title, entry.content);
    }

    await stmt.finalize();
    res.status(201).json({ message: 'Entradas guardadas exitosamente' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Obtener entradas paginadas y filtradas
router.get('/entries', async (req, res) => {
  try {
    const {
      page = 1,
      pageSize = 10,
      sign,
      type,
      lang,
      theme,
      search
    } = req.query;

    const offset = (page - 1) * pageSize;
    const filters = [];
    const params = [];

    if (sign) { filters.push('sign = ?'); params.push(sign); }
    if (type) { filters.push('type = ?'); params.push(type); }
    if (lang) { filters.push('lang = ?'); params.push(lang); }
    if (theme) { filters.push('theme = ?'); params.push(theme); }
    if (search) { filters.push('(title LIKE ? OR content LIKE ?)'); params.push(`%${search}%`, `%${search}%`); }

    const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

    const entries = await db.all(
      `SELECT * FROM horoscope_entries ${whereClause} ORDER BY createdAt DESC LIMIT ? OFFSET ?`,
      ...params, pageSize, offset
    );

    const total = await db.get(
      `SELECT COUNT(*) as count FROM horoscope_entries ${whereClause}`,
      ...params
    );

    res.json({ total: total.count, entries });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Descargar todas las entradas como archivo JSON
router.get('/entries/backup', async (req, res) => {
  try {
    const entries = await db.all(`SELECT * FROM horoscope_entries ORDER BY createdAt DESC`);
    res.status(200).json(entries)
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});
// Obtener entradas paginadas y filtradas
router.get('/entries/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const entry = await db.get(
      `SELECT * FROM horoscope_entries where id = ?`,
      id
    );
    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Editar entrada por ID
router.put('/entries/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const entry = req.body;
    const horoscopeEntry = new HoroscopeEntry(entry)

    validateBaseEntry(horoscopeEntry);
    validateBulkEntry(horoscopeEntry);

    await db.run(
      `UPDATE horoscope_entries
       SET sign = ?, type = ?, lang = ?, theme = ?, title = ?, content = ?
       WHERE id = ?`,
      horoscopeEntry.sign,
      horoscopeEntry.type,
      horoscopeEntry.lang,
      horoscopeEntry.theme,
      horoscopeEntry.title,
      horoscopeEntry.content,
      id
    );

    res.json({ message: 'Entrada actualizada' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Eliminar entrada por ID
router.delete('/entries/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await db.run(`DELETE FROM horoscope_entries WHERE id = ?`, id);
    res.json({ message: 'Entrada eliminada' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export { router, initializeDB };
