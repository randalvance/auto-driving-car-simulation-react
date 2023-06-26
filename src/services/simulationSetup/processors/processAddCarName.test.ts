import { MESSAGE_ERROR_INVALID_FORMAT } from '@/constants';
import { processAddCarName } from './processAddCarName';
import { initialState } from '@/store/initialState';

it('should set car name', () => {
  const carName = 'car1';

  const newState = processAddCarName(
    {
      ...initialState,
      setup: {
        inputStep: 'addCarName',
        consoleMessages: [],
        cars: [],
      },
    },
    carName,
  );

  expect(newState.setup.carToAdd?.name).toBe(carName);
  expect(newState.setup.inputStep).toBe('addCarPosition');
});

it('should trim car name', () => {
  const carName = '  car1  ';

  const newState = processAddCarName(
    {
      ...initialState,
      setup: {
        inputStep: 'addCarName',
        consoleMessages: [],
        cars: [],
      },
    },
    carName,
  );

  expect(newState.setup.carToAdd?.name).toBe('car1');
  expect(newState.setup.inputStep).toBe('addCarPosition');
});

it.each(['', ' '])('should validate empty car name (%s)', (carName) => {
  const newState = processAddCarName(
    {
      ...initialState,
      setup: {
        inputStep: 'addCarName',
        consoleMessages: [],
        cars: [],
      },
    },
    carName,
  );

  expect(newState.setup.inputStep).toBe('addCarName');
  expect(newState.setup.carToAdd?.name).toBeUndefined();
  expect(newState.setup.consoleMessages).toEqual([
    MESSAGE_ERROR_INVALID_FORMAT,
  ]);
});
