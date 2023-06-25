import { produce } from 'immer';
import { type Car, type Simulation } from '@/types';
import { moveCar } from './moveCar';

/** Orchestrates moving and car-collision check. */
export const simulate = (simulation: Simulation): Simulation => {
  const carsAfterMove = simulation.cars.map((car) => {
    if (hasCommandsLeft(car)) {
      return moveCar(car, simulation.field);
    }
    return car;
  });
  return produce(simulation, (draft) => {
    draft.step += 1;
    draft.cars = carsAfterMove;
  });
};

const hasCommandsLeft = (car: Car): boolean => {
  return car.commandCursor < car.commands.length;
};
