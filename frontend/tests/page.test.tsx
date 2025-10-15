
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Home from '../app/page';

describe('Home component', () => {
  it('should render correctly', () => {
    const { container } = render(<Home />);
    expect(container).toMatchSnapshot();
  });
});
