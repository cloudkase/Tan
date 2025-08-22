/* Items routes: supports list (with optional pagination), get by ID, create with validation. Uses async file I/O. */

const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();
const DATA_PATH = path.join(__dirname, '../../../data/items.json');

/** Read items.json asynchronously */
async function readData() {
  const raw = await fs.readFile(DATA_PATH, 'utf-8');
  return JSON.parse(raw);
}

/** Write items.json with a temp file then rename (reduces risk of partial writes) */
async function writeData(data) {
  const tmp = DATA_PATH + '.tmp';
  await fs.writeFile(tmp, JSON.stringify(data, null, 2));
  await fs.rename(tmp, DATA_PATH);
}

/**
 * GET /api/items
 * Modes:
 *  - Legacy (default): returns an array (optionally limited by ?limit=)
 *  - Paginated: when ?paginate=true returns { data, page, limit, total, pages }
 */
router.get('/', async (req, res, next) => {
  try {
    const data = await readData();
    const paginate = String(req.query.paginate).toLowerCase() === 'true';

    if (!paginate) {
      const limit = Math.max(0, parseInt(req.query.limit, 10) || 0);
      const result = limit ? data.slice(0, limit) : data;
      return res.json(result);
    }

    // Paginated mode
    const limit = Math.max(1, parseInt(req.query.limit, 10) || 20);
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const total = data.length;
    const pages = Math.max(1, Math.ceil(total / limit));
    const start = (page - 1) * limit;
    const end = start + limit;
    const slice = data.slice(start, end);

    res.json({ data: slice, page, limit, total, pages });
  } catch (err) {
    next(err);
  }
});

// GET /api/items/:id
router.get('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const data = await readData();
    const item = data.find(x => x.id === id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    next(err);
  }
});

// POST /api/items
/** Create a new item with basic validation */
router.post('/', async (req, res, next) => {
  try {
    const { name, category, price } = req.body || {};
    if (typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ message: 'name is required' });
    }
    if (typeof category !== 'string' || !category.trim()) {
      return res.status(400).json({ message: 'category is required' });
    }
    const numericPrice = Number(price);
    if (!Number.isFinite(numericPrice) || numericPrice < 0) {
      return res.status(400).json({ message: 'price must be a non-negative number' });
    }

    const data = await readData();
    const item = { id: Date.now(), name: name.trim(), category: category.trim(), price: numericPrice };
    data.push(item);
    await writeData(data);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
