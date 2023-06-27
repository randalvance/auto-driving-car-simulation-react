import { MESSAGE_ERROR_INVALID_FORMAT } from '@/constants';
import { initialState } from '@/store/initialState';
import { processSelectOption } from './processSelectOption';

it('should parse option 1 as adding car', () => {
  const newState = processSelectOption(
    {
      ...initialState,
      setup: {
        inputStep: 'selectOption',
        consoleMessages: [],
      },
    },
    '1',
  );

  expect(newState.setup.inputStep).toBe('addCarName');
});

it('should parse option 2 as running simulation', () => {
  const newState = processSelectOption(
    {
      ...initialState,
      setup: {
        inputStep: 'selectOption',
        consoleMessages: [],
      },
    },
    '2',
  );

  expect(newState.setup.inputStep).toBe('runningSimulation');
  expect(newState.setup.consoleMessages).toEqual([]);
});

it.each(['', ' ', '0', '3', 'ABC'])(
  'should validate wrong input (%s)',
  (input) => {
    const newState = processSelectOption(
      {
        ...initialState,
        setup: {
          inputStep: 'selectOption',
          consoleMessages: [],
        },
      },
      input,
    );

    expect(newState.setup.inputStep).toBe('selectOption');
    expect(newState.setup.consoleMessages).toEqual([
      MESSAGE_ERROR_INVALID_FORMAT,
    ]);
  },
);
