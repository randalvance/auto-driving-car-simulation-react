import { MESSAGE_ERROR_INVALID_FORMAT } from '@/constants';
import { processSetFieldSize } from './processSetFieldSize';

it('should parse field size', () => {
  const setupState = processSetFieldSize(
    {
      inputStep: 'setFieldSize',
      consoleMessages: [],
    },
    '10 5',
  );

  expect(setupState.inputStep).toBe('selectOption');
  expect(setupState.fieldSize).toEqual({ width: 10, height: 5 });
});

it.each(['', ' ', '1', '1 2 3', 'ABC', '1 2 X', '10 10a'])(
  'should validate wrong input format (%s)',
  (input) => {
    const setupState = processSetFieldSize(
      {
        inputStep: 'setFieldSize',
        consoleMessages: [],
      },
      input,
    );

    expect(setupState.inputStep).toBe('setFieldSize');
    expect(setupState.fieldSize).toBeUndefined();
    expect(setupState.consoleMessages).toEqual([MESSAGE_ERROR_INVALID_FORMAT]);
  },
);
