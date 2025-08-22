import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from '../pages/App';

test('renders paginated items list with pager controls', async () => {
  process.env.REACT_APP_USE_PAGINATION = 'true';

  // Mock fetch
  global.fetch = jest.fn((url) => {
    if (url.includes('page=1')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          data: [{ id: 1, name: 'Item A' }, { id: 2, name: 'Item B' }],
          page: 1, limit: 10, total: 25, pages: 3
        })
      });
    }
    if (url.includes('page=2')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          data: [{ id: 11, name: 'Item C' }, { id: 12, name: 'Item D' }],
          page: 2, limit: 10, total: 25, pages: 3
        })
      });
    }
    return Promise.reject(new Error('Unexpected fetch: ' + url));
  });

  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  );

  expect(await screen.findByText('Item A')).toBeInTheDocument();
  expect(screen.getByText(/Page 1 \/ 3/)).toBeInTheDocument();

  // get all "Next" buttons and click the last one (bottom pager)
  const nextButtons = screen.getAllByRole('button', { name: 'Next' });
  await userEvent.click(nextButtons[nextButtons.length - 1]);

  expect(await screen.findByText('Item C')).toBeInTheDocument();
  expect(screen.getByText(/Page 2 \/ 3/)).toBeInTheDocument();
});
