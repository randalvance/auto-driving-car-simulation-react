import { produce } from 'immer';
import { type Car, type Simulation } from '@/types';
import { moveCar } from './moveCar';
import { detectCollisions } from './detectCollisions';

/** Orchestrates moving and car-collision check. */
export const simulate = (simulation: Simulation): Simulation => {
  const nextStep = simulation.step + 1;
  let carsAfterMove = simulation.cars;

  for (const car of simulation.cars) {
    if (!hasCommandsLeft(car)) {
      continue;
    }
    const carAfterMove = moveCar(car, simulation.field);
    carsAfterMove = detectCollisions(
      carAfterMove.name,
      carsAfterMove,
      nextStep,
    );
  }

  return produce(simulation, (draft) => {
    draft.step = nextStep;
    draft.cars = carsAfterMove;
  });
};

const hasCommandsLeft = (car: Car): boolean => {
  return car.commandCursor < car.commands.length;
};
