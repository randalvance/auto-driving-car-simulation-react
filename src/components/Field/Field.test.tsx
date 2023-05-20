import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import { Field } from './Field';

describe('Field', () => {
  describe('should render field with correct height and width', () => {
    [
      { width: 1, height: 2, expectedHtmlWidth: 50, expectedHtmlHeight: 100 },
      { width: 3, height: 3, expectedHtmlWidth: 150, expectedHtmlHeight: 150 },
      {
        width: 10,
        height: 5,
        expectedHtmlWidth: 500,
        expectedHtmlHeight: 250,
      },
    ].forEach(({ width, height, expectedHtmlWidth, expectedHtmlHeight }) => {
      it(`when width=${width} and height=${height}`, async () => {
        render(<Field width={width} height={height} cars={[]} />);

        const field = screen.getByRole('field');
        expect(field.style.height).toBe(`${expectedHtmlHeight}px`);
        expect(field.style.width).toBe(`${expectedHtmlWidth}px`);
      });
    });
  });

  it('should render cars at correct position and facing the right direction', async () => {
    render(
      <Field
        width={10}
        height={10}
        cars={[
          { name: 'Car1', x: 1, y: 2, facing: 'N' },
          { name: 'Car2', x: 4, y: 3, facing: 'S' },
        ]}
      />,
    );
    const cars = screen.getAllByRole('car');
    expect(cars).toHaveLength(2);

    const car1 = cars[0];
    expect(car1.style.bottom).toBe('100px');
    expect(car1.style.left).toBe('50px');
    expect(car1.style.transform).toBe('rotate(0deg)');

    const car2 = cars[1];
    expect(car2.style.bottom).toBe('200px');
    expect(car2.style.left).toBe('150px');
    expect(car2.style.transform).toBe('rotate(180deg)');
  });
});
