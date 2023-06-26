import { initialState } from '@/store/initialState';
import { MESSAGE_ERROR_INVALID_FORMAT } from '@/constants';
import { processSetFieldSize } from './processSetFieldSize';

it('should parse field size', () => {
  const newState = processSetFieldSize(
    {
      ...initialState,
      setup: {
        inputStep: 'setFieldSize',
        consoleMessages: [],
        cars: [],
      },
    },
    '10 5',
  );

  expect(newState.setup.inputStep).toBe('selectOption');
  expect(newState.setup.fieldSize).toEqual({ width: 10, height: 5 });
});

it.each(['', ' ', '1', '1 2 3', 'ABC', '1 2 X', '10 10a'])(
  'should validate wrong input format (%s)',
  (input) => {
    const newState = processSetFieldSize(
      {
        ...initialState,
        setup: {
          inputStep: 'setFieldSize',
          consoleMessages: [],
          cars: [],
        },
      },
      input,
    );

    expect(newState.setup.inputStep).toBe('setFieldSize');
    expect(newState.setup.fieldSize).toBeUndefined();
    expect(newState.setup.consoleMessages).toEqual([
      MESSAGE_ERROR_INVALID_FORMAT,
    ]);
  },
);
