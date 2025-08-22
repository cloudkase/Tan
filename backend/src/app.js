const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const { getItems, getItemById, createItem, _items } = require('./itemsController');

const app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());

app.get('/api/items', getItems);
app.get('/api/items/:id', getItemById);
app.post('/api/items', createItem);

app.get('/api/stats', (req, res) => {
  const total = _items.length;
  const sum = _items.reduce((acc, cur) => acc + (Number(cur.price) || 0), 0);
  const averagePrice = total ? sum / total : 0;
  res.json({ total, averagePrice });
});

app.get('/health', (req,res)=> res.json({ ok: true }));

app.use((req,res)=> res.status(404).json({ message: 'Route Not Found' }));

module.exports = app;
