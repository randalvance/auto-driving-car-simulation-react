import { type SimulationSetup } from '@/types';
import { type CommandResult } from './types';

export const stateWithError = (
  state: SimulationSetup,
  ...errors: string[]
): CommandResult => {
  return {
    setupState: state,
    errors,
  };
};
