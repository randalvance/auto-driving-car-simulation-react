import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import { Field } from './Field';

describe('Field', () => {
  describe('should render field with correct height and width', () => {
    [
      { width: 1, height: 2, expectedHtmlWidth: 100, expectedHtmlHeight: 200 },
      { width: 3, height: 3, expectedHtmlWidth: 300, expectedHtmlHeight: 300 },
      {
        width: 10,
        height: 5,
        expectedHtmlWidth: 1000,
        expectedHtmlHeight: 500,
      },
    ].forEach(({ width, height, expectedHtmlWidth, expectedHtmlHeight }) => {
      it(`when width=${width} and height=${height}`, async () => {
        render(<Field width={width} height={height} />);

        const field = screen.getByRole('field');
        expect(field.style.height).toBe(`${expectedHtmlHeight}px`);
        expect(field.style.width).toBe(`${expectedHtmlWidth}px`);
      });
    });
  });

  describe('should render cars at correct position', () => {
    it('when there is one car', async () => {
      render(<Field width={10} height={10} cars={[{ x: 1, y: 2 }]} />);
      const cars = screen.getAllByRole('car');
      expect(cars).toHaveLength(1);
      const car = cars[0];
      expect(car.style.bottom).toBe('200px');
      expect(car.style.left).toBe('100px');
    });
  });
});
