import { type Car } from '@/types';
import { reportCarCollisions } from './reportCarCollisions';

const baseCar = {
  moveHistory: '',
  historyCursor: 0,
} satisfies Partial<Car>;

it('should report car collisions', () => {
  const cars: Car[] = [
    {
      ...baseCar,
      name: 'car1',
      x: 1,
      y: 2,
      commandCursor: 1,
      commands: 'F',
      direction: 'N',
      collisionInfo: [
        { carName: 'car2', step: 1 },
        { carName: 'car4', step: 2 },
      ],
    },
    {
      ...baseCar,
      name: 'car2',
      x: 1,
      y: 2,
      commandCursor: 1,
      commands: 'F',
      direction: 'S',
      collisionInfo: [
        { carName: 'car1', step: 1 },
        { carName: 'car4', step: 2 },
      ],
    },
    {
      ...baseCar,
      name: 'car3',
      x: 3,
      y: 5,
      commandCursor: 1,
      commands: 'F',
      direction: 'W',
      collisionInfo: [],
    },
    {
      ...baseCar,
      name: 'car4',
      x: 1,
      y: 2,
      commandCursor: 2,
      commands: 'FF',
      direction: 'W',
      collisionInfo: [
        { carName: 'car2', step: 2 },
        { carName: 'car1', step: 2 },
      ],
    },
  ];

  const report = reportCarCollisions(cars);

  expect(report).toEqual(`After simulation, the result is:
- car1, collides with car2 at (1, 2) at step 1
- car1, collides with car4 at (1, 2) at step 2
- car2, collides with car1 at (1, 2) at step 1
- car2, collides with car4 at (1, 2) at step 2
- car3, (3, 5) W
- car4, collides with car2 at (1, 2) at step 2
- car4, collides with car1 at (1, 2) at step 2`);
});
