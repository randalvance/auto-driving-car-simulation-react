import { type InputStep, type SimulationSetup } from '@/types';
import { type CommandProcessor } from './types';
import {
  defaultCommandProcessor,
  processAddCarCommand,
  processAddCarName,
  processAddCarPosition,
  processSelectOption,
  processSetFieldSize,
} from './processors';

const commandProcessors: Record<InputStep, CommandProcessor> = {
  initialize: defaultCommandProcessor,
  setFieldSize: processSetFieldSize,
  selectOption: processSelectOption,
  addCarName: processAddCarName,
  addCarPosition: processAddCarPosition,
  addCarCommands: processAddCarCommand,
  runningSimulation: defaultCommandProcessor,
};

export const processCommand = (
  state: SimulationSetup,
  commandString: string,
): SimulationSetup => {
  const setupState = commandProcessors[state.inputStep](state, commandString);

  return setupState;
};
