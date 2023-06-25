import { type SimulationSetup } from '@/types';

export type CommandProcessor = (
  state: SimulationSetup,
  commandString: string,
) => SimulationSetup;
