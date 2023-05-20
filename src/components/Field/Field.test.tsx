import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import { Field } from './Field';

describe('Field', () => {
    it('should render Field', async () => {
        render(<Field height={10} width={10} />);

        await screen.findByRole('heading');

        expect(screen.getByRole('heading')).toHaveTextContent('Hello World');
    });
});
