import { MESSAGE_ERROR_INVALID_FORMAT } from '@/constants';
import { processSelectOption } from './processSelectOption';

it('should parse option 1 as adding car', () => {
  const setupState = processSelectOption(
    {
      inputStep: 'selectOption',
      consoleMessages: [],
      cars: [],
    },
    '1',
  );

  expect(setupState.inputStep).toBe('addCarName');
});

it('should parse option 2 as running simulation', () => {
  const setupState = processSelectOption(
    {
      inputStep: 'selectOption',
      consoleMessages: [],
      cars: [],
    },
    '2',
  );

  expect(setupState.inputStep).toBe('runningSimulation');
});

it.each(['', ' ', '0', '3', 'ABC'])(
  'should validate wrong input (%s)',
  (input) => {
    const setupState = processSelectOption(
      {
        inputStep: 'selectOption',
        consoleMessages: [],
        cars: [],
      },
      input,
    );

    expect(setupState.inputStep).toBe('selectOption');
    expect(setupState.consoleMessages).toEqual([MESSAGE_ERROR_INVALID_FORMAT]);
  },
);
