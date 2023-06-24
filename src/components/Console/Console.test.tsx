import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Console } from '@/components/Console/Console';
import userEvent from '@testing-library/user-event';
import { useStore } from '@/store';

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

  it('should call dispatchCommand when enter is pressed', async () => {
    const dispatchCommandSpy = vi.fn();
    useStore.setState({
      dispatchCommand: dispatchCommandSpy,
    });
    render(<Console messages={[]} />);

    const input = screen.getByRole<HTMLInputElement>('input');
    await userEvent.type(input, '20 20');
    expect(input.value).toBe('20 20');
    await userEvent.type(input, '{enter}');
    expect(dispatchCommandSpy).toHaveBeenCalledWith('20 20');
  });

  it('should hide input when disabled', async () => {
    render(<Console messages={[]} disabled />);
    const input = screen.queryByRole<HTMLInputElement>('input');
    expect(input).toBeFalsy();
  });
});
