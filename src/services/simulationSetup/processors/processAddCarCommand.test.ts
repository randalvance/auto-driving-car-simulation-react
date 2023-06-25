import { vi, vitest } from 'vitest';
import {
  MESSAGE_ERROR_OUT_OF_BOUNDS,
  processAddCarCommand,
} from './processAddCarCommand';
import { reportCarList } from './reportCarList';

vitest.mock('./reportCarList', () => ({ reportCarList: vitest.fn() }));
const mockedReportCarList = vi.mocked(reportCarList);

describe('processAddCarCommand', () => {
  const mockedCarReport = 'Cars List';
  beforeEach(() => {
    mockedReportCarList.mockReturnValue(mockedCarReport);
  });
  it('should add car to list and reset cars to add', () => {
    const setupState = processAddCarCommand(
      {
        inputStep: 'addCarCommands',
        carToAdd: {
          name: 'car1',
          x: 0,
          y: 1,
          direction: 'N',
        },
        consoleMessages: [],
        cars: [],
        fieldSize: {
          width: 10,
          height: 10,
        },
      },
      'FLRF',
    );

    expect(setupState.inputStep).toBe('selectOption');
    expect(setupState.carToAdd).toBeUndefined();
    expect(setupState.cars).toEqual([
      {
        name: 'car1',
        x: 0,
        y: 1,
        direction: 'N',
        commands: 'FLRF',
        commandCursor: 0,
        moveHistory: '',
        historyCursor: 0,
      },
    ]);
    expect(setupState.consoleMessages).toEqual([mockedCarReport]);
  });

  it('should NOT add car to list if out of bounds', () => {
    const setupState = processAddCarCommand(
      {
        inputStep: 'addCarCommands',
        carToAdd: {
          name: 'car1',
          /* x and y are 0 based but field sizes are 1 based */
          x: 10,
          y: 10,
          direction: 'N',
        },
        consoleMessages: [],
        cars: [],
        fieldSize: {
          width: 10,
          height: 10,
        },
      },
      'FLRF',
    );

    expect(setupState.inputStep).toBe('selectOption');
    expect(setupState.carToAdd).toBeUndefined();
    expect(setupState.cars).toEqual([]);
    expect(setupState.consoleMessages).toEqual([
      MESSAGE_ERROR_OUT_OF_BOUNDS,
      mockedCarReport,
    ]);
  });
});
