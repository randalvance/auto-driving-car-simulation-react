import { MESSAGE_ERROR_INVALID_FORMAT } from '@/constants';
import { processAddCarPosition } from './processAddCarPosition';
import { initialState } from '@/store/initialState';

it('should set x y and direction', () => {
  const newState = processAddCarPosition(
    {
      ...initialState,
      setup: {
        inputStep: 'addCarPosition',
        carToAdd: {
          name: 'car1',
        },
        consoleMessages: [],
        cars: [],
      },
    },
    '1 2 N',
  );

  expect(newState.setup.inputStep).toBe('addCarCommands');
  expect(newState.setup.carToAdd?.name).toBe('car1');
  expect(newState.setup.carToAdd?.x).toBe(1);
  expect(newState.setup.carToAdd?.y).toBe(2);
  expect(newState.setup.carToAdd?.direction).toBe('N');
});

it.each(['', ' ', '1', '1 2', '1 2 3', 'ABC', '1 2 N 4', '1 2 X'])(
  'should validate wrong input format (%s)',
  (input) => {
    const newState = processAddCarPosition(
      {
        ...initialState,
        setup: {
          inputStep: 'addCarPosition',
          carToAdd: {
            name: 'car1',
          },
          consoleMessages: [],
          cars: [],
        },
      },
      input,
    );

    expect(newState.setup.inputStep).toBe('addCarPosition');
    expect(newState.setup.carToAdd?.name).toBe('car1');
    expect(newState.setup.carToAdd?.x).toBeUndefined();
    expect(newState.setup.carToAdd?.y).toBeUndefined();
    expect(newState.setup.consoleMessages).toEqual([
      MESSAGE_ERROR_INVALID_FORMAT,
    ]);
  },
);
