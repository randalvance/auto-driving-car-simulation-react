import { type Simulation } from '@/types';
import { _hasCommandsLeft } from './_hasCommandsLeft';

/** Checks if simulation is already over */
export const isSimulationComplete = (simulation: Simulation): boolean => {
  return simulation.cars.every((car) => !_hasCommandsLeft(car));
};
