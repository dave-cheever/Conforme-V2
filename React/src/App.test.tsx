import React from 'react';

import { render, screen } from '@testing-library/react';

import App from './bootstrap/app';

test('renders learn react link', () => {
  render(<App data-id="09420bb3a7f1" />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
