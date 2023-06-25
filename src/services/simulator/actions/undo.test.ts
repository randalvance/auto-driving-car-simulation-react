import { vitest } from 'vitest';
import { type Field, type Car } from '@/types';
import { undo } from './undo';
import { moveBackward } from './moveBackward';
import { turnRight } from './turnRight';
import { turnLeft } from './turnLeft';

vitest.mock('./moveBackward', () => ({ moveBackward: vitest.fn() }));
const mockedMoveBackward = vitest.mocked(moveBackward);

vitest.mock('./turnRight', () => ({ turnRight: vitest.fn() }));
const mockedTurnRight = vitest.mocked(turnRight);

vitest.mock('./turnLeft', () => ({ turnLeft: vitest.fn() }));
const mockedTurnLeft = vitest.mocked(turnLeft);

describe('undo', () => {
  const field: Field = { width: 10, height: 10 };

  beforeEach(() => {
    vitest.resetAllMocks();
  });

  it('should move backward if last move was forward', () => {
    const car: Car = {
      name: 'car1',
      x: 1,
      y: 1,
      direction: 'N',
      commands: 'FFU',
      commandCursor: 2,
      moveHistory: 'FF',
      historyCursor: 1,
    };
    mockedMoveBackward.mockReturnValue(car);

    const carAfterUndo = undo(car, field);

    expect(carAfterUndo.commandCursor).toBe(2);
    expect(carAfterUndo.historyCursor).toBe(0);
    expect(mockedMoveBackward).toHaveBeenCalledWith(car, field, false);
  });

  it('should turn right if last move was left', () => {
    const car: Car = {
      name: 'car1',
      x: 1,
      y: 1,
      direction: 'N',
      commands: 'FLU',
      commandCursor: 2,
      moveHistory: 'FL',
      historyCursor: 1,
    };
    mockedTurnRight.mockReturnValue(car);

    const carAfterUndo = undo(car, field);

    expect(carAfterUndo.commandCursor).toBe(2);
    expect(carAfterUndo.historyCursor).toBe(0);
    expect(mockedTurnRight).toHaveBeenCalledWith(car, field, false);
  });

  it('should turn left if last move was right', () => {
    const car: Car = {
      name: 'car1',
      x: 1,
      y: 1,
      direction: 'N',
      commands: 'FRU',
      commandCursor: 2,
      moveHistory: 'FR',
      historyCursor: 1,
    };
    mockedTurnLeft.mockReturnValue(car);

    const carAfterUndo = undo(car, field);

    expect(carAfterUndo.commandCursor).toBe(2);
    expect(carAfterUndo.historyCursor).toBe(0);
    expect(mockedTurnLeft).toHaveBeenCalledWith(car, field, false);
  });
});
