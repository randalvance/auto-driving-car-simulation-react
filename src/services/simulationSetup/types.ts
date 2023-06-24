import { type SimulationSetup } from '@/types';

export type CommandProcessor = (
  state: SimulationSetup,
  commandString: string,
) => CommandResult;

export interface CommandResult {
  setupState: SimulationSetup;
  errors: string[];
}
