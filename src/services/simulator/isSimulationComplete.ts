import { type Simulation } from '@/types';
import { _isCarComplete } from './_hasCommandsLeft';

/** Checks if simulation is already over */
export const isSimulationComplete = (simulation: Simulation): boolean => {
  return simulation.cars.every((car) => _isCarComplete(car));
};
