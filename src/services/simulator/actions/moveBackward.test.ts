import { type Field, type Car, type Direction } from '@/types';
import { moveBackward } from './moveBackward';

const baseCar = {
  x: 1,
  y: 1,
  direction: 'N',
  commands: 'F',
  commandCursor: 0,
  moveHistory: '',
  historyCursor: 0,
} satisfies Partial<Car>;

it('should move the car forward North', () => {
  const car: Car = {
    ...baseCar,
    name: 'car1',
  };
  const field: Field = { width: 10, height: 10 };

  const carAfterMove = moveBackward(car, field);

  expect(carAfterMove).toEqual({
    ...car,
    y: 0,
  });
});

it('should move the car forward East', () => {
  const car: Car = {
    ...baseCar,
    name: 'car1',
    direction: 'E',
  };
  const field: Field = { width: 10, height: 10 };

  const carAfterMove = moveBackward(car, field);

  expect(carAfterMove).toEqual({
    ...car,
    x: 0,
  });
});

it('should move the car forward South', () => {
  const car: Car = {
    ...baseCar,
    name: 'car1',
    x: 0,
    y: 7,
    direction: 'S',
  };
  const field: Field = { width: 10, height: 10 };

  const carAfterMove = moveBackward(car, field);

  expect(carAfterMove).toEqual({
    ...car,
    y: 8,
  });
});

it('should move the car forward West', () => {
  const car: Car = {
    ...baseCar,
    name: 'car1',
    x: 5,
    y: 0,
    direction: 'W',
  };
  const field: Field = { width: 10, height: 10 };

  const carAfterMove = moveBackward(car, field);

  expect(carAfterMove).toEqual({
    ...car,
    x: 6,
  });
});

it.each([
  { carX: 5, carY: 0, carDirection: 'N' },
  { carX: 0, carY: 6, carDirection: 'E' },
  { carX: 9, carY: 1, carDirection: 'W' },
  { carX: 3, carY: 9, carDirection: 'S' },
])(
  'shoult not move the car backward if out of bounds ($carX, $carY, $carDirection)',
  ({ carX, carY, carDirection }) => {
    const car: Car = {
      ...baseCar,
      name: 'car1',
      x: carX,
      y: carY,
      direction: carDirection as Direction,
    };
    const field: Field = { width: 10, height: 10 };

    const carAfterMove = moveBackward(car, field);

    expect(carAfterMove).toEqual({
      ...car,
      commandCursor: 1,
    });
  },
);
