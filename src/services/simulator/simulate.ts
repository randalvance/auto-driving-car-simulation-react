import { produce } from 'immer';
import { type State } from '@/types';
import { moveCar } from './moveCar';
import { detectCollisions } from './detectCollisions';
import { _isCarComplete } from './_hasCommandsLeft';

/** Orchestrates moving and car-collision check. */
export const simulate = (state: State): State => {
  const { simulation } = state;

  let carsAfterChange = [...simulation.cars];

  for (let i = 0; i < simulation.cars.length; i++) {
    const car = carsAfterChange[i];

    if (_isCarComplete(car)) {
      continue;
    }

    carsAfterChange[i] = moveCar(car, simulation.field);

    carsAfterChange = detectCollisions(car.name, carsAfterChange);
  }

  return produce(state, (draft) => {
    draft.simulation.cars = carsAfterChange;
  });
};
