import { type Field, type Car, type Direction } from '@/types';
import { moveForward } from './moveFoward';

it('should move the car forward North', () => {
  const car: Car = {
    name: 'car1',
    x: 0,
    y: 0,
    direction: 'N',
    commands: 'F',
    commandCursor: 0,
  };
  const field: Field = { width: 10, height: 10 };

  const carAfterMove = moveForward(car, field);

  expect(carAfterMove).toEqual({
    ...car,
    y: 1,
    commandCursor: 1,
  });
});

it('should move the car forward East', () => {
  const car: Car = {
    name: 'car1',
    x: 0,
    y: 0,
    direction: 'E',
    commands: 'F',
    commandCursor: 0,
  };
  const field: Field = { width: 10, height: 10 };

  const carAfterMove = moveForward(car, field);

  expect(carAfterMove).toEqual({
    ...car,
    x: 1,
    commandCursor: 1,
  });
});

it('should move the car forward South', () => {
  const car: Car = {
    name: 'car1',
    x: 0,
    y: 9,
    direction: 'S',
    commands: 'F',
    commandCursor: 0,
  };
  const field: Field = { width: 10, height: 10 };

  const carAfterMove = moveForward(car, field);

  expect(carAfterMove).toEqual({
    ...car,
    y: 8,
    commandCursor: 1,
  });
});

it('should move the car forward West', () => {
  const car: Car = {
    name: 'car1',
    x: 9,
    y: 0,
    direction: 'W',
    commands: 'F',
    commandCursor: 0,
  };
  const field: Field = { width: 10, height: 10 };

  const carAfterMove = moveForward(car, field);

  expect(carAfterMove).toEqual({
    ...car,
    x: 8,
    commandCursor: 1,
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
      name: 'car1',
      x: carX,
      y: carY,
      direction: carDirection as Direction,
      commands: 'F',
      commandCursor: 0,
    };
    const field: Field = { width: 10, height: 10 };

    const carAfterMove = moveForward(car, field);

    expect(carAfterMove).toEqual({
      ...car,
      commandCursor: 1,
    });
  },
);
