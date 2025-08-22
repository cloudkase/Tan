/* Stats route: computes and caches stats (total, averagePrice) for items.json. */

const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
// Correct path to project-level data file
const DATA_PATH = path.join(__dirname, '../../../data/items.json');

// Simple caching using file mtime. Invalidates when file changes.
let cachedStats = null;
let cachedMtime = null;

function computeStats(items) {
  const total = items.length;
  const sum = items.reduce((acc, cur) => acc + (Number(cur.price) || 0), 0);
  const averagePrice = total ? sum / total : 0;
  return { total, averagePrice };
}

router.get('/', (req, res, next) => {
  fs.stat(DATA_PATH, (err, stats) => {
    if (err) return next(err);
    const mtime = stats.mtimeMs;

    if (cachedStats && cachedMtime === mtime) {
      return res.json(cachedStats);
    }

    fs.readFile(DATA_PATH, 'utf-8', (err, raw) => {
      if (err) return next(err);
      try {
        const items = JSON.parse(raw);
        cachedStats = computeStats(items);
        cachedMtime = mtime;
        res.json(cachedStats);
      } catch (e) {
        next(e);
      }
    });
  });
});

module.exports = router;
