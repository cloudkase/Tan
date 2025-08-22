import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from '../pages/App';

describe('Items page (paginated mode)', () => {
  beforeEach(() => {
    process.env.REACT_APP_USE_PAGINATION = 'true';
    global.fetch = jest.fn((url) => {
      if (url.includes('page=1')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            data: [{ id: 1, name: 'Laptop Pro' }, { id: 2, name: 'Ultra Monitor' }],
            page: 1, limit: 10, total: 12, pages: 2
          })
        });
      }
      if (url.includes('page=2')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            data: [{ id: 11, name: 'Gaming Chair' }, { id: 12, name: 'Standing Desk' }],
            page: 2, limit: 10, total: 12, pages: 2
          })
        });
      }
      return Promise.reject(new Error('Unexpected fetch: ' + url));
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
    delete process.env.REACT_APP_USE_PAGINATION;
  });

  test('renders paginated list and navigates pages', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText('Laptop Pro')).toBeInTheDocument();
    expect(screen.getByText('Ultra Monitor')).toBeInTheDocument();
    expect(screen.getByText(/Page 1 \/ 2/)).toBeInTheDocument();

    // Click last "Next" button (bottom pager)
    const nextButtons = screen.getAllByRole('button', { name: 'Next' });
    await userEvent.click(nextButtons[nextButtons.length - 1]);

    expect(await screen.findByText('Gaming Chair')).toBeInTheDocument();
    expect(screen.getByText('Standing Desk')).toBeInTheDocument();
    expect(screen.getByText(/Page 2 \/ 2/)).toBeInTheDocument();
  });
});
