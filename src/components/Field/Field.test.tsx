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
        render(
          <Field width={width} height={height} cars={[]} collidedCars={[]} />,
        );

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
          { name: 'Car3', x: 5, y: 1, facing: 'W' },
          { name: 'Car4', x: 0, y: 0, facing: 'E' },
        ]}
        collidedCars={[]}
      />,
    );
    const cars = screen.getAllByRole('car');
    expect(cars).toHaveLength(4);

    const car1 = cars[0];
    expect(car1.style.left).toBe('50px');
    expect(car1.style.bottom).toBe('100px');
    expect(car1.style.transform).toBe('rotate(0deg)');

    const car2 = cars[1];
    expect(car2.style.left).toBe('200px');
    expect(car2.style.bottom).toBe('150px');
    expect(car2.style.transform).toBe('rotate(180deg)');

    const car3 = cars[2];
    expect(car3.style.left).toBe('250px');
    expect(car3.style.bottom).toBe('50px');
    expect(car3.style.transform).toBe('rotate(270deg)');

    const car4 = cars[3];
    expect(car4.style.left).toBe('0px');
    expect(car4.style.bottom).toBe('0px');
    expect(car4.style.transform).toBe('rotate(90deg)');
  });

  it('should render labels', async () => {
    render(
      <Field
        width={10}
        height={10}
        cars={[
          { name: 'Car1', x: 1, y: 2, facing: 'N' },
          { name: 'Car2', x: 4, y: 3, facing: 'S' },
          { name: 'Car3', x: 5, y: 1, facing: 'W' },
          { name: 'Car4', x: 0, y: 0, facing: 'E' },
        ]}
        collidedCars={[]}
      />,
    );
    const labels = screen.getAllByRole('label');
    expect(labels).toHaveLength(4);

    const label1 = labels[0];
    expect(label1.style.left).toBe('50px');
    expect(label1.style.bottom).toBe('150px');

    const label2 = labels[1];
    expect(label2.style.left).toBe('200px');
    expect(label2.style.bottom).toBe('200px');

    const label3 = labels[2];
    expect(label3.style.left).toBe('250px');
    expect(label3.style.bottom).toBe('100px');

    const label4 = labels[3];
    expect(label4.style.left).toBe('0px');
    expect(label4.style.bottom).toBe('50px');
  });

  it('should render collisions as explosion', async () => {
    render(
      <Field
        width={10}
        height={10}
        cars={[
          { name: 'Car1', x: 0, y: 1, facing: 'N' },
          { name: 'Car2', x: 0, y: 1, facing: 'S' },
          { name: 'Car3', x: 1, y: 2, facing: 'S' },
        ]}
        collidedCars={['Car1', 'Car2']}
      />,
    );

    const cars = screen.getAllByRole('car');
    const car1 = cars[0];
    expect(car1.className).toContain('explosion');

    const car2 = cars[1];
    expect(car2.className).toContain('explosion');

    const car3 = cars[2];
    expect(car3.className).not.toContain('explosion');
  });
});
