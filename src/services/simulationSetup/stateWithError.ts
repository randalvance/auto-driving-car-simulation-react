import { type SimulationSetup } from '@/types';

export const stateWithError = (
  state: SimulationSetup,
  ...errors: string[]
): SimulationSetup => {
  return {
    ...state,
    consoleMessages: [...errors],
  };
};
