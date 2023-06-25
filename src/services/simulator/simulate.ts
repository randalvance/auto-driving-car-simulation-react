import { produce } from 'immer';
import { type Simulation } from '@/types';
import { moveCar } from './moveCar';
import { detectCollisions } from './detectCollisions';
import { _hasCommandsLeft } from './_hasCommandsLeft';

/** Orchestrates moving and car-collision check. */
export const simulate = (simulation: Simulation): Simulation => {
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

  return produce(simulation, (newSimulation) => {
    newSimulation.step = step;
    newSimulation.cars = carsAfterChange;
  });
};
