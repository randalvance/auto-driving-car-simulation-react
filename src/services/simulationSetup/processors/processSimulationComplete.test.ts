import { MESSAGE_ERROR_INVALID_FORMAT } from '@/constants';
import { processSimulationComplete } from './processSimulationComplete';

it('should parse option 1 as starting over', () => {
  const setupState = processSimulationComplete(
    {
      inputStep: 'simulationComplete',
      consoleMessages: [],
      cars: [],
    },
    '1',
  );

  expect(setupState.inputStep).toBe('initialize');
});

it('should parse option 2 as exit', () => {
  const setupState = processSimulationComplete(
    {
      inputStep: 'simulationComplete',
      consoleMessages: [],
      cars: [],
    },
    '2',
  );

  expect(setupState.inputStep).toBe('exit');
  expect(setupState.consoleMessages).toEqual([]);
});

it.each(['', ' ', '0', '3', 'ABC'])(
  'should validate wrong input (%s)',
  (input) => {
    const setupState = processSimulationComplete(
      {
        inputStep: 'simulationComplete',
        consoleMessages: [],
        cars: [],
      },
      input,
    );

    expect(setupState.inputStep).toBe('simulationComplete');
    expect(setupState.consoleMessages).toEqual([MESSAGE_ERROR_INVALID_FORMAT]);
  },
);
