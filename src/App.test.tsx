import { render } from '@testing-library/react';
import React from 'react';
import App from './App';

xit('renders something', () => {
  const { getByTestId } = render(<App />);
  const el = getByTestId('container');
  expect(el).toBeInTheDocument();
});
