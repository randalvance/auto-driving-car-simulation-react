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
    collisionInfo: [{ carName: 'car4', step: 0 }],
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
    collisionInfo: [{ carName: 'car2', step: 0 }],
  };
  const cars: Car[] = [car1, car2, car3, car4];
  const currentStep = 1;

  const carsWithCollisionInfo = detectCollisions(car1.name, cars, currentStep);

  expect(carsWithCollisionInfo).toEqual([
    {
      ...car1,
      collisionInfo: [
        { carName: car2.name, step: currentStep },
        { carName: car4.name, step: currentStep },
      ],
    },
    {
      ...car2,
      collisionInfo: [
        { carName: car4.name, step: 0 },
        { carName: car1.name, step: currentStep },
      ],
    },
    car3,
    {
      ...car4,
      collisionInfo: [
        { carName: car2.name, step: 0 },
        { carName: car1.name, step: currentStep },
      ],
    },
  ]);
});
