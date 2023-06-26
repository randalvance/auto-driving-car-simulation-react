import { vitest, vi } from 'vitest';
import { type Simulation, type Car, type State } from '@/types';
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

  const state: State = {
    setup: { inputStep: 'runningSimulation', cars: [], consoleMessages: [] },
    simulation: {
      field: { width: 0, height: 0 },
      cars: [car1, car2],
    },
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should move and check collision for each uncompleted car', () => {
    mockedMoveCar.mockReturnValueOnce(car1);
    mockedMoveCar.mockReturnValueOnce(car2);
    mockedDetectCollisions.mockReturnValueOnce(state.simulation.cars);
    mockedDetectCollisions.mockReturnValueOnce(state.simulation.cars);

    simulate(state);

    expect(mockedMoveCar).toHaveBeenCalledWith(car1, state.simulation.field);
    expect(mockedMoveCar).toHaveBeenCalledWith(car2, state.simulation.field);
    expect(mockedDetectCollisions).toHaveBeenCalledWith(
      car1.name,
      state.simulation.cars,
    );
    expect(mockedDetectCollisions).toHaveBeenCalledWith(
      car2.name,
      state.simulation.cars,
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
      ...state.simulation,
      cars: [uncompletedCar1, completedCar1],
    };
    mockedMoveCar.mockReturnValueOnce(uncompletedCar1);
    mockedMoveCar.mockReturnValueOnce(completedCar1);
    mockedDetectCollisions.mockReturnValueOnce(simulation.cars);
    mockedDetectCollisions.mockReturnValueOnce(simulation.cars);

    simulate({
      ...state,
      simulation,
    });

    expect(mockedMoveCar).toHaveBeenCalledWith(
      uncompletedCar1,
      simulation.field,
    );
    expect(mockedDetectCollisions).toHaveBeenCalledWith(
      uncompletedCar1.name,
      simulation.cars,
    );
    expect(mockedMoveCar).not.toHaveBeenCalledWith(
      completedCar1,
      simulation.field,
    );
    expect(mockedDetectCollisions).not.toHaveBeenCalledWith(
      completedCar1.name,
      simulation.cars,
    );
  });
});
