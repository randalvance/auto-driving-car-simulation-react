import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Console } from '@/components/Console/Console';

describe('Console', () => {
  it('should render messages', async () => {
    render(<Console messages={['Message 1', 'Message 2']} />);

    const messages = screen.getAllByRole('message');
    expect(messages).toHaveLength(2);
  });

  it('should render an input', async () => {
    render(<Console messages={[]} />);

    const input = screen.getByRole('input');
    expect(input).toBeInTheDocument();
  });
});
