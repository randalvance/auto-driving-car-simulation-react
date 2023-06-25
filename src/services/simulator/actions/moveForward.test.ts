import { type Field, type Car, type Direction } from '@/types';
import { moveForward } from './moveFoward';

const baseCar = {
  direction: 'N',
  commandCursor: 0,
  moveHistory: '',
  historyCursor: 0,
} satisfies Partial<Car>;

it('should move the car forward North', () => {
  const car: Car = {
    ...baseCar,
    name: 'car1',
    x: 0,
    y: 0,
    commands: 'F',
  };
  const field: Field = { width: 10, height: 10 };

  const carAfterMove = moveForward(car, field);

  expect(carAfterMove).toEqual({
    ...car,
    y: 1,
  });
});

it('should move the car forward East', () => {
  const car: Car = {
    ...baseCar,
    name: 'car1',
    x: 0,
    y: 0,
    direction: 'E',
    commands: 'F',
  };
  const field: Field = { width: 10, height: 10 };

  const carAfterMove = moveForward(car, field);

  expect(carAfterMove).toEqual({
    ...car,
    x: 1,
  });
});

it('should move the car forward South', () => {
  const car: Car = {
    ...baseCar,
    name: 'car1',
    x: 0,
    y: 9,
    direction: 'S',
    commands: 'F',
  };
  const field: Field = { width: 10, height: 10 };

  const carAfterMove = moveForward(car, field);

  expect(carAfterMove).toEqual({
    ...car,
    y: 8,
  });
});

it('should move the car forward West', () => {
  const car: Car = {
    ...baseCar,
    name: 'car1',
    x: 9,
    y: 0,
    direction: 'W',
    commands: 'F',
  };
  const field: Field = { width: 10, height: 10 };

  const carAfterMove = moveForward(car, field);

  expect(carAfterMove).toEqual({
    ...car,
    x: 8,
  });
});

it.each([
  { carX: 0, carY: 9, carDirection: 'N' },
  { carX: 9, carY: 0, carDirection: 'E' },
  { carX: 0, carY: 9, carDirection: 'W' },
  { carX: 9, carY: 0, carDirection: 'S' },
])(
  'shoult not move the car forward if out of bounds ($carX, $carY, $carDirection)',
  ({ carX, carY, carDirection }) => {
    const car: Car = {
      ...baseCar,
      name: 'car1',
      x: carX,
      y: carY,
      direction: carDirection as Direction,
      commands: 'F',
    };
    const field: Field = { width: 10, height: 10 };

    const carAfterMove = moveForward(car, field);

    expect(carAfterMove).toEqual({
      ...car,
      commandCursor: 1,
    });
  },
);
