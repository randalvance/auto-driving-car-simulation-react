import { type Car } from '@/types';
import { detectCollisions } from './detectCollisions';

const baseCar = {
  x: 1,
  y: 1,
  direction: 'N',
  commands: 'F',
  commandCursor: 0,
} satisfies Partial<Car>;

it('should detect all cars that a car have collided with', () => {
  const car1: Car = {
    ...baseCar,
    name: 'car1',
    x: 1,
    y: 1,
  };
  const car2: Car = {
    ...baseCar,
    name: 'car2',
    x: 1,
    y: 1,
    direction: 'E',
  };
  const car3: Car = {
    ...baseCar,
    name: 'car3',
    x: 2,
    y: 1,
  };
  const car4: Car = {
    ...baseCar,
    name: 'car4',
    x: 1,
    y: 1,
    direction: 'S',
  };
  const cars: Car[] = [car1, car2, car3, car4];

  const collidedCars = detectCollisions(car1.name, cars);

  expect(collidedCars).toEqual([car2.name, car4.name]);
});
