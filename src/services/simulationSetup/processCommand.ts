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
import { getPromptForInputStep } from './getPromptForInputStep';

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
): { setup: SimulationSetup; messages: string[] } => {
  const { setupState, errors } = commandProcessors[state.inputStep](
    state,
    commandString,
  );

  const promptMessages = getPromptForInputStep(setupState.inputStep);

  return {
    setup: setupState,
    messages: [...errors, ...promptMessages],
  };
};
