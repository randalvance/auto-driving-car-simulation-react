import { type Field, type Car, type Direction } from '@/types';
import { turnRight } from './turnRight';

it.each([
  { sourceDirection: 'N', expectedDirection: 'E' },
  { sourceDirection: 'E', expectedDirection: 'S' },
  { sourceDirection: 'S', expectedDirection: 'W' },
  { sourceDirection: 'W', expectedDirection: 'N' },
])(
  'should turn the car to the right $sourceDirection -> $expectedDirection',
  ({ sourceDirection, expectedDirection }) => {
    const car: Car = {
      name: 'car1',
      x: 5,
      y: 5,
      direction: sourceDirection as Direction,
      commandCursor: 0,
      commands: 'R',
    };
    const field: Field = { width: 10, height: 10 };
    const carAfterMove = turnRight(car, field);
    expect(carAfterMove).toEqual({
      ...car,
      direction: expectedDirection as Direction,
    });
  },
);
