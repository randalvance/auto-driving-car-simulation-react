import { initialState } from '@/store/initialState';
import { MESSAGE_ERROR_INVALID_FORMAT } from '@/constants';
import { processSetFieldSize } from './processSetFieldSize';
import { type Field } from '@/types';

it('should parse field size', () => {
  const newState = processSetFieldSize(
    {
      ...initialState,
      setup: {
        inputStep: 'setFieldSize',
        consoleMessages: [],
      },
    },
    '10 5',
  );

  expect(newState.setup.inputStep).toBe('selectOption');
  expect(newState.simulation.field).toEqual({ width: 10, height: 5 });
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
        },
      },
      input,
    );

    expect(newState.setup.inputStep).toBe('setFieldSize');
    expect(newState.simulation.field).toEqual({
      width: 0,
      height: 0,
    } satisfies Field);
    expect(newState.setup.consoleMessages).toEqual([
      MESSAGE_ERROR_INVALID_FORMAT,
    ]);
  },
);
