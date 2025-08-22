const request = require('supertest');
const app = require('../src/app');

describe('Items API', () => {
  it('GET /api/items returns array (legacy)', async () => {
    const res = await request(app).get('/api/items');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('GET /api/items?paginate=true returns paginated object', async () => {
    const res = await request(app).get('/api/items?paginate=true&page=1&limit=2');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeLessThanOrEqual(2);
    expect(res.body).toHaveProperty('page', 1);
    expect(res.body).toHaveProperty('limit', 2);
    expect(res.body).toHaveProperty('total');
    expect(res.body).toHaveProperty('pages');
  });

  it('GET /api/items/:id returns a single item', async () => {
    const list = await request(app).get('/api/items');
    const id = list.body[0].id;
    const res = await request(app).get('/api/items/' + id);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', id);
  });

  it('POST /api/items validates payload', async () => {
    const bad = await request(app).post('/api/items').send({});
    expect(bad.status).toBe(400);
    const good = await request(app).post('/api/items').send({ name: "X", description: "Y", price: 1 });
    expect(good.status).toBe(201);
  });
});
