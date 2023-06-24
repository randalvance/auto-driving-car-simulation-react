import { MESSAGE_ERROR_INVALID_FORMAT } from '@/constants';
import { processAddCarName } from './processAddCarName';

it('should set car name', () => {
  const carName = 'car1';

  const { setupState } = processAddCarName(
    {
      inputStep: 'addCarName',
    },
    carName,
  );

  expect(setupState.carToAdd?.name).toBe(carName);
  expect(setupState.inputStep).toBe('addCarPosition');
});

it('should trim car name', () => {
  const carName = '  car1  ';

  const { setupState } = processAddCarName(
    {
      inputStep: 'addCarName',
    },
    carName,
  );

  expect(setupState.carToAdd?.name).toBe('car1');
  expect(setupState.inputStep).toBe('addCarPosition');
});

it.each(['', ' '])('should validate empty car name (%s)', (carName) => {
  const { setupState, errors } = processAddCarName(
    {
      inputStep: 'addCarName',
    },
    carName,
  );

  expect(setupState.inputStep).toBe('addCarName');
  expect(setupState.carToAdd?.name).toBeUndefined();
  expect(errors).toEqual([MESSAGE_ERROR_INVALID_FORMAT]);
});
