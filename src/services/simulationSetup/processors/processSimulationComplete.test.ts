import { MESSAGE_ERROR_INVALID_FORMAT } from '@/constants';
import { processSimulationComplete } from './processSimulationComplete';
import { initialState } from '@/store/initialState';

it('should parse option 1 as starting over', () => {
  const newState = processSimulationComplete(
    {
      ...initialState,
      setup: {
        inputStep: 'simulationComplete',
        consoleMessages: [],
      },
    },
    '1',
  );

  expect(newState.setup.inputStep).toBe('initialize');
});

it('should parse option 2 as exit', () => {
  const newState = processSimulationComplete(
    {
      ...initialState,
      setup: {
        inputStep: 'simulationComplete',
        consoleMessages: [],
      },
    },
    '2',
  );

  expect(newState.setup.inputStep).toBe('exit');
  expect(newState.setup.consoleMessages).toEqual([]);
});

it.each(['', ' ', '0', '3', 'ABC'])(
  'should validate wrong input (%s)',
  (input) => {
    const newState = processSimulationComplete(
      {
        ...initialState,
        setup: {
          inputStep: 'simulationComplete',
          consoleMessages: [],
        },
      },
      input,
    );

    expect(newState.setup.inputStep).toBe('simulationComplete');
    expect(newState.setup.consoleMessages).toEqual([
      MESSAGE_ERROR_INVALID_FORMAT,
    ]);
  },
);
