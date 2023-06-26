import { vi, vitest } from 'vitest';
import {
  MESSAGE_ERROR_OUT_OF_BOUNDS,
  processAddCarCommand,
} from './processAddCarCommand';
import { reportCarList } from '../reporters';
import { type State } from '@/types';
import { initialState } from '@/store/initialState';

vitest.mock('../reporters', () => ({ reportCarList: vitest.fn() }));
const mockedReportCarList = vi.mocked(reportCarList);

describe('processAddCarCommand', () => {
  const state = {
    ...initialState,
  } satisfies State;
  const mockedCarReport = 'Cars List';

  beforeEach(() => {
    mockedReportCarList.mockReturnValue(mockedCarReport);
  });
  it('should add car to list and reset cars to add', () => {
    const newState = processAddCarCommand(
      {
        ...state,
        setup: {
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
      },
      'FLRF',
    );

    expect(newState.setup.inputStep).toBe('selectOption');
    expect(newState.setup.carToAdd).toBeUndefined();
    expect(newState.setup.cars).toEqual([
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
    expect(newState.setup.consoleMessages).toEqual([mockedCarReport]);
  });

  it('should NOT add car to list if out of bounds', () => {
    const newState = processAddCarCommand(
      {
        ...state,
        setup: {
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
      },
      'FLRF',
    );

    expect(newState.setup.inputStep).toBe('selectOption');
    expect(newState.setup.carToAdd).toBeUndefined();
    expect(newState.setup.cars).toEqual([]);
    expect(newState.setup.consoleMessages).toEqual([
      MESSAGE_ERROR_OUT_OF_BOUNDS,
      mockedCarReport,
    ]);
  });
});
