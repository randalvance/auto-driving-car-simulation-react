import { produce } from 'immer';
import { vi, vitest } from 'vitest';
import {
  MESSAGE_ERROR_CAR_AT_SAME_POS_EXISTS,
  MESSAGE_ERROR_CAR_EXISTS,
  MESSAGE_ERROR_OUT_OF_BOUNDS,
  processAddCarCommand,
} from './processAddCarCommand';
import { reportCarList } from '../reporters';
import { initialState } from '@/store/initialState';

vitest.mock('../reporters', () => ({ reportCarList: vitest.fn() }));
const mockedReportCarList = vi.mocked(reportCarList);

describe('processAddCarCommand', () => {
  const state = produce(initialState, (draft) => {
    draft.simulation.field = {
      width: 10,
      height: 10,
    };
  });
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
        },
      },
      'FLRF',
    );

    expect(newState.setup.inputStep).toBe('selectOption');
    expect(newState.setup.carToAdd).toBeUndefined();
    expect(newState.simulation.cars).toEqual([
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
        },
      },
      'FLRF',
    );

    expect(newState.setup.inputStep).toBe('selectOption');
    expect(newState.setup.carToAdd).toBeUndefined();
    expect(newState.simulation.cars).toEqual([]);
    expect(newState.setup.consoleMessages).toEqual([
      MESSAGE_ERROR_OUT_OF_BOUNDS,
      mockedCarReport,
    ]);
  });

  it('should NOT add car to the list if existing car with the same name already exists', () => {
    const state = produce(initialState, (draft) => {
      draft.simulation.cars = [
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
      ];
      draft.simulation.field = { width: 10, height: 10 };
      draft.setup.carToAdd = {
        name: 'car1',
        x: 1,
        y: 2,
      };
    });

    const newState = processAddCarCommand(state, 'FLRF');

    expect(newState.simulation.cars.length).toBe(1);
    expect(newState.simulation.cars[0]).toEqual(state.simulation.cars[0]);
    expect(newState.setup.consoleMessages).toEqual([
      MESSAGE_ERROR_CAR_EXISTS,
      mockedCarReport,
    ]);
    expect(newState.setup.inputStep).toBe('selectOption');
  });

  it('should NOT add car to the list if a car at the same position already exists', () => {
    const state = produce(initialState, (draft) => {
      draft.simulation.cars = [
        {
          name: 'car1',
          x: 1,
          y: 2,
          direction: 'N',
          commands: 'FLRF',
          commandCursor: 0,
          moveHistory: '',
          historyCursor: 0,
        },
      ];
      draft.simulation.field = { width: 10, height: 10 };
      draft.setup.carToAdd = {
        name: 'car2',
        direction: 'S',
        x: 1,
        y: 2,
      };
    });

    const newState = processAddCarCommand(state, 'FLRF');

    expect(newState.simulation.cars.length).toBe(1);
    expect(newState.simulation.cars[0]).toEqual(state.simulation.cars[0]);
    expect(newState.setup.consoleMessages).toEqual([
      MESSAGE_ERROR_CAR_AT_SAME_POS_EXISTS,
      mockedCarReport,
    ]);
    expect(newState.setup.inputStep).toBe('selectOption');
  });
});
