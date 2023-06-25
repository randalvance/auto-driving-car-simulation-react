import { MESSAGE_ERROR_INVALID_FORMAT } from '@/constants';
import { processAddCarPosition } from './processAddCarPosition';

it('should set x y and direction', () => {
  const setupState = processAddCarPosition(
    {
      inputStep: 'addCarPosition',
      carToAdd: {
        name: 'car1',
      },
      consoleMessages: [],
      cars: [],
    },
    '1 2 N',
  );

  expect(setupState.inputStep).toBe('addCarCommands');
  expect(setupState.carToAdd?.name).toBe('car1');
  expect(setupState.carToAdd?.x).toBe(1);
  expect(setupState.carToAdd?.y).toBe(2);
  expect(setupState.carToAdd?.direction).toBe('N');
});

it.each(['', ' ', '1', '1 2', '1 2 3', 'ABC', '1 2 N 4', '1 2 X'])(
  'should validate wrong input format (%s)',
  (input) => {
    const setupState = processAddCarPosition(
      {
        inputStep: 'addCarPosition',
        carToAdd: {
          name: 'car1',
        },
        consoleMessages: [],
        cars: [],
      },
      input,
    );

    expect(setupState.inputStep).toBe('addCarPosition');
    expect(setupState.carToAdd?.name).toBe('car1');
    expect(setupState.carToAdd?.x).toBeUndefined();
    expect(setupState.carToAdd?.y).toBeUndefined();
    expect(setupState.consoleMessages).toEqual([MESSAGE_ERROR_INVALID_FORMAT]);
  },
);
