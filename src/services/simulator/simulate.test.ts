import { vitest, vi } from 'vitest';
import { type Simulation, type Car } from '@/types';
import { simulate } from './simulate';
import { moveCar } from './moveCar';
import { detectCollisions } from './detectCollisions';

vitest.mock('./moveCar', () => ({
  moveCar: vitest.fn(),
}));
const mockedMoveCar = vi.mocked(moveCar);
vitest.mock('./detectCollisions', () => ({
  detectCollisions: vitest.fn(),
}));
const mockedDetectCollisions = vi.mocked(detectCollisions);

describe('simulate', () => {
  const baseCar = {
    direction: 'N',
    commands: 'F',
    commandCursor: 0,
    moveHistory: '',
    historyCursor: 0,
  } satisfies Partial<Car>;
  const car1: Car = {
    ...baseCar,
    name: 'car1',
    x: 0,
    y: 0,
  };
  const car2: Car = {
    ...baseCar,
    name: 'car2',
    x: 1,
    y: 0,
  };
  const baseSimulation: Simulation = {
    step: 0,
    field: { width: 0, height: 0 },
    cars: [car1, car2],
  };

  beforeEach(() => {
    vi.resetAllMocks();
    mockedMoveCar.mockImplementation((car) =>
      car.name === car1.name ? car1 : car2,
    );
    mockedDetectCollisions.mockReturnValue([...baseSimulation.cars]);
  });

  it('should move and check collision for each uncompleted car', () => {
    simulate(baseSimulation);

    expect(mockedMoveCar).toHaveBeenCalledWith(car1, baseSimulation.field);
    expect(mockedMoveCar).toHaveBeenCalledWith(car2, baseSimulation.field);
    expect(mockedDetectCollisions).toHaveBeenCalledWith(
      car1.name,
      baseSimulation.cars,
      baseSimulation.step + 1,
    );
    expect(mockedDetectCollisions).toHaveBeenCalledWith(
      car2.name,
      baseSimulation.cars,
      baseSimulation.step + 1,
    );
  });

  it('should not move and not check collision completed cars', () => {
    const uncompletedCar1: Car = {
      ...baseCar,
      name: 'car1',
      x: 0,
      y: 0,
      commandCursor: 1,
      commands: 'FF',
    };
    const completedCar1: Car = {
      ...baseCar,
      name: 'car2',
      x: 0,
      y: 1,
      commandCursor: 1,
      commands: 'F',
    };
    const simulation: Simulation = {
      ...baseSimulation,
      step: 1,
      cars: [uncompletedCar1, completedCar1],
    };
    mockedMoveCar.mockReturnValueOnce(uncompletedCar1);
    mockedMoveCar.mockReturnValueOnce(completedCar1);
    mockedDetectCollisions.mockReturnValueOnce(simulation.cars);
    mockedDetectCollisions.mockReturnValueOnce(simulation.cars);

    simulate(simulation);

    expect(mockedMoveCar).toHaveBeenCalledWith(
      uncompletedCar1,
      simulation.field,
    );
    expect(mockedDetectCollisions).toHaveBeenCalledWith(
      uncompletedCar1.name,
      simulation.cars,
      simulation.step + 1,
    );
    expect(mockedMoveCar).not.toHaveBeenCalledWith(
      completedCar1,
      simulation.field,
    );
    expect(mockedDetectCollisions).not.toHaveBeenCalledWith(
      completedCar1.name,
      simulation.cars,
      simulation.step + 1,
    );
  });

  it('should increment step by 1', () => {
    const result = simulate(baseSimulation);
    expect(result).toBeTruthy();
    expect(result.step).toBe(1);
  });
});
