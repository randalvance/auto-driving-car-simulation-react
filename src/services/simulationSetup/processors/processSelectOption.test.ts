import { MESSAGE_ERROR_INVALID_FORMAT } from '@/constants';
import { processSelectOption } from './processSelectOption';

it('should parse option 1 as adding car', () => {
  const { setupState } = processSelectOption(
    {
      inputStep: 'selectOption',
    },
    '1',
  );

  expect(setupState.inputStep).toBe('addCarName');
});

it('should parse option 2 as running simulation', () => {
  const { setupState } = processSelectOption(
    {
      inputStep: 'selectOption',
    },
    '2',
  );

  expect(setupState.inputStep).toBe('runningSimulation');
});

it.each(['', ' ', '0', '3', 'ABC'])(
  'should validate wrong input (%s)',
  (input) => {
    const { setupState, errors } = processSelectOption(
      {
        inputStep: 'selectOption',
      },
      input,
    );

    expect(setupState.inputStep).toBe('selectOption');
    expect(errors).toEqual([MESSAGE_ERROR_INVALID_FORMAT]);
  },
);
