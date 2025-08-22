import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../pages/App';

beforeEach(() => {
  global.fetch = jest.fn((url) => {
    if (String(url).startsWith('/api/items')) {
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

test('renders items list from API (legacy mode)', async () => {
  process.env.REACT_APP_USE_PAGINATION = 'false';
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  );
  expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  expect(await screen.findByText('Laptop Pro')).toBeInTheDocument();
});
