import '@testing-library/jest-dom';

// optional: silence React Router future warnings
const origWarn = console.warn;
beforeAll(() => {
  console.warn = (...args) => {
    const msg = String(args[0] || '');
    if (msg.includes('React Router Future Flag Warning')) return;
    origWarn(...args);
  };
});
afterAll(() => {
  console.warn = origWarn;
});
