import { produce } from 'immer';
import { type State } from '@/types';
import { moveCar } from './moveCar';
import { detectCollisions } from './detectCollisions';
import { _hasCommandsLeft } from './_hasCommandsLeft';
import { isSimulationComplete } from './isSimulationComplete';
import { processCommand } from '../simulationSetup';

/** Orchestrates moving and car-collision check. */
export const simulate = (state: State): State => {
  const { simulation } = state;
  const step = simulation.step + 1;

  let carsAfterChange = [...simulation.cars];

  for (let i = 0; i < simulation.cars.length; i++) {
    const car = carsAfterChange[i];

    if (!_hasCommandsLeft(car)) {
      continue;
    }

    carsAfterChange[i] = moveCar(car, simulation.field);

    carsAfterChange = detectCollisions(car.name, carsAfterChange, step);
  }

  let newState = produce(state, (draft) => {
    draft.simulation.step = step;
    draft.simulation.cars = carsAfterChange;
  });

  if (isSimulationComplete(newState.simulation)) {
    newState = processCommand(newState, 'complete', false);
  }

  return newState;
};
