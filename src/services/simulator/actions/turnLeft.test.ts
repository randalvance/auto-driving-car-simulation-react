import { type Field, type Car, type Direction } from '@/types';
import { turnLeft } from './turnLeft';

it.each([
  { sourceDirection: 'N', expectedDirection: 'W' },
  { sourceDirection: 'W', expectedDirection: 'S' },
  { sourceDirection: 'S', expectedDirection: 'E' },
  { sourceDirection: 'E', expectedDirection: 'N' },
])(
  'should turn the car to the left $sourceDirection -> $expectedDirection',
  ({ sourceDirection, expectedDirection }) => {
    const car: Car = {
      name: 'car1',
      x: 5,
      y: 5,
      direction: sourceDirection as Direction,
      commandCursor: 0,
      commands: 'L',
      moveHistory: '',
      historyCursor: 0,
    };
    const field: Field = { width: 10, height: 10 };
    const carAfterMove = turnLeft(car, field);
    expect(carAfterMove).toEqual({
      ...car,
      direction: expectedDirection as Direction,
    });
  },
);
