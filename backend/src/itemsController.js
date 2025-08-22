const items = [
  { id: 1, name: "Laptop Pro", description: "High-end laptop", price: 1999 },
  { id: 2, name: "Ultra Monitor", description: "Large display", price: 499 },
  { id: 3, name: "Gaming Chair", description: "Ergonomic chair", price: 299 },
  { id: 4, name: "Standing Desk", description: "Adjustable desk", price: 699 },
];

exports._items = items; // export for stats

exports.getItems = (req, res) => {
  const { paginate, page = 1, limit = 10 } = req.query;
  if (String(paginate).toLowerCase() === "true") {
    const p = Math.max(1, parseInt(page, 10) || 1);
    const l = Math.max(1, parseInt(limit, 10) || 10);
    const start = (p - 1) * l;
    const data = items.slice(start, start + l);
    return res.json({ data, page: p, limit: l, total: items.length, pages: Math.ceil(items.length / l) });
  }
  res.json(items);
};

exports.getItemById = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const item = items.find(i => i.id === id);
  if (!item) return res.status(404).json({ message: "Item not found" });
  res.json(item);
};

exports.createItem = (req, res) => {
  const { name, description, price } = req.body || {};
  if (typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ message: "Name is required" });
  }
  if (typeof description !== 'string' || !description.trim()) {
    return res.status(400).json({ message: "Description is required" });
  }
  const numericPrice = Number(price);
  if (!Number.isFinite(numericPrice) || numericPrice < 0) {
    return res.status(400).json({ message: "Price must be a non-negative number" });
  }
  const newItem = { id: items.length + 1, name: name.trim(), description: description.trim(), price: numericPrice };
  items.push(newItem);
  res.status(201).json(newItem);
};
