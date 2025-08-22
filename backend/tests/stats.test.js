const request = require('supertest');
const app = require('../src/app');

describe('Stats API', () => {
  it('GET /api/stats returns totals and averagePrice', async () => {
    const res = await request(app).get('/api/stats');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('total');
    expect(res.body).toHaveProperty('averagePrice');
    expect(typeof res.body.total).toBe('number');
    expect(typeof res.body.averagePrice).toBe('number');
  });
});
