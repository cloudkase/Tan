import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../pages/App';

beforeEach(() => {
  global.fetch = jest.fn((url) => {
    const u = String(url);
    if (u.endsWith('/api/items/1')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          id: 1,
          name: 'Laptop Pro',
          category: 'Computers',
          price: 1999
        }),
      });
    }
    if (u.startsWith('/api/items')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ id: 1, name: 'Laptop Pro' }]),
      });
    }
    return Promise.reject(new Error('Unexpected fetch: ' + url));
  });
});

afterEach(() => {
  jest.resetAllMocks();
  delete process.env.REACT_APP_USE_PAGINATION;
});

test('renders item detail', async () => {
  process.env.REACT_APP_USE_PAGINATION = 'false';
  render(
    <MemoryRouter initialEntries={['/items/1']}> 
      <App />
    </MemoryRouter>
  );
  expect(await screen.findByText('Laptop Pro')).toBeInTheDocument();
  expect(screen.getByText(/Category:/)).toBeInTheDocument();
  expect(screen.getByText(/Price:/)).toBeInTheDocument();
});
