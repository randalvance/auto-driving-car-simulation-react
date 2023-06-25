import { produce } from 'immer';
import { type Car, type Simulation } from '@/types';
import { moveCar } from './moveCar';
import { detectCollisions } from './detectCollisions';

/** Orchestrates moving and car-collision check. */
export const simulate = (simulation: Simulation): Simulation => {
  const step = simulation.step + 1;

  let carsAfterChange = simulation.cars;

  for (let i = 0; i < simulation.cars.length; i++) {
    const car = simulation.cars[i];

    if (!hasCommandsLeft(car)) {
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

const hasCommandsLeft = (car: Car): boolean => {
  return car.commandCursor < car.commands.length;
};
