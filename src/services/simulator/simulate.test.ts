import { vitest, vi } from 'vitest';
import { type Simulation, type Car } from '@/types';
import { simulate } from './simulate';
import { moveCar } from './moveCar';

vitest.mock('./moveCar', () => ({
  moveCar: vitest.fn(),
}));
const mockedMoveCar = vi.mocked(moveCar);

describe('simulate', () => {
  const car1: Car = {
    name: 'car1',
    x: 0,
    y: 0,
    direction: 'N',
    commands: 'F',
    commandCursor: 0,
  };
  const car2: Car = {
    name: 'car1',
    x: 1,
    y: 0,
    direction: 'N',
    commands: 'F',
    commandCursor: 0,
  };
  const baseSimulation: Simulation = {
    step: 0,
    field: { width: 0, height: 0 },
    cars: [car1, car2],
  };

  beforeEach(() => {
    vi.resetAllMocks();
    mockedMoveCar.mockReturnValue(car1);
  });

  it('should move each uncompleted car', () => {
    simulate(baseSimulation);
    expect(mockedMoveCar).toHaveBeenCalledWith(car1, baseSimulation.field);
    expect(mockedMoveCar).toHaveBeenCalledWith(car2, baseSimulation.field);
  });

  it('should not move completed cars', () => {
    const uncompletedCar1: Car = {
      name: 'car1',
      x: 0,
      y: 0,
      direction: 'N',
      commandCursor: 1,
      commands: 'FF',
    };
    const completedCar1: Car = {
      name: 'car2',
      x: 0,
      y: 1,
      direction: 'N',
      commandCursor: 1,
      commands: 'F',
    };
    const simulation: Simulation = {
      ...baseSimulation,
      step: 1,
      cars: [uncompletedCar1, completedCar1],
    };

    simulate(simulation);

    expect(mockedMoveCar).toHaveBeenCalledWith(
      uncompletedCar1,
      baseSimulation.field,
    );
    expect(mockedMoveCar).not.toHaveBeenCalledWith(
      completedCar1,
      baseSimulation.field,
    );
  });

  it('should increment step by 1', () => {
    const result = simulate(baseSimulation);
    expect(result).toBeTruthy();
    expect(result.step).toBe(1);
  });
});
