import { type Car } from '@/types';
import { isSimulationComplete } from './isSimulationComplete';

const baseCar = {
  moveHistory: '',
  historyCursor: 0,
} satisfies Partial<Car>;

it('should return true if all cars are complete', () => {
  const result = isSimulationComplete({
    step: 0,
    field: {
      width: 5,
      height: 5,
    },
    cars: [
      {
        ...baseCar,
        name: 'car1',
        x: 0,
        y: 0,
        direction: 'N',
        commandCursor: 1,
        commands: 'F',
      },
      {
        ...baseCar,
        name: 'car2',
        x: 0,
        y: 0,
        direction: 'N',
        commandCursor: 2,
        commands: 'FR',
      },
    ],
  });

  expect(result).toBe(true);
});

it('should return false if not all cars are complete', () => {
  const result = isSimulationComplete({
    step: 0,
    field: {
      width: 5,
      height: 5,
    },
    cars: [
      {
        ...baseCar,
        name: 'car1',
        x: 0,
        y: 0,
        direction: 'N',
        commandCursor: 1,
        commands: 'F',
      },
      {
        ...baseCar,
        name: 'car2',
        x: 0,
        y: 0,
        direction: 'N',
        commandCursor: 1,
        commands: 'FR',
      },
    ],
  });

  expect(result).toBe(false);
});
