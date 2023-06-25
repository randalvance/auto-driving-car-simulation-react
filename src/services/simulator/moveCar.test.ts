import { vi, vitest } from 'vitest';
import { type Field, type Car } from '@/types';

import { moveCar } from './moveCar';
import { moveForward, turnLeft, turnRight } from './actions';

vitest.mock('./actions', () => ({
  moveForward: vitest.fn(),
  turnLeft: vitest.fn(),
  turnRight: vitest.fn(),
}));
const mockedMoveForward = vi.mocked(moveForward);
const mockedTurnLeft = vi.mocked(turnLeft);
const mockedTurnRight = vi.mocked(turnRight);

describe('moveCar', () => {
  const baseCar: Car = {
    name: 'car1',
    x: 5,
    y: 5,
    direction: 'N',
    commands: 'F',
    commandCursor: 0,
  };
  const field: Field = { width: 10, height: 10 };
  beforeEach(() => {
    vi.resetAllMocks();
    mockedMoveForward.mockReturnValue(baseCar);
  });
  it('should move commandCursor forward', () => {
    const carAfterMove = moveCar(baseCar, field);

    expect(carAfterMove).toEqual({
      ...baseCar,
      commandCursor: 1,
    });
  });
  it('should move forward if command at cursor is F', () => {
    const car: Car = {
      ...baseCar,
      commands: 'RLF',
      commandCursor: 2,
    };
    mockedMoveForward.mockReturnValueOnce(car);

    moveCar(car, field);

    expect(mockedMoveForward).toHaveBeenCalledWith(car, field);
  });
  it('should turn left if command at cursor is L', () => {
    const car: Car = {
      ...baseCar,
      commands: 'FLF',
      commandCursor: 1,
    };
    mockedTurnLeft.mockReturnValueOnce(car);

    moveCar(car, field);

    expect(mockedTurnLeft).toHaveBeenCalledWith(car, field);
  });
  it('should turn right if command at cursor is R', () => {
    const car: Car = {
      ...baseCar,
      commands: 'FRF',
      commandCursor: 1,
    };
    mockedTurnRight.mockReturnValueOnce(car);

    moveCar(car, field);

    expect(mockedTurnRight).toHaveBeenCalledWith(car, field);
  });
});
