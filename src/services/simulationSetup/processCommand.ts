import { produce } from 'immer';
import { type InputStep, type SimulationSetup } from '@/types';
import { type CommandProcessor } from './types';
import {
  defaultCommandProcessor,
  processAddCarCommand,
  processAddCarName,
  processAddCarPosition,
  processInitialize,
  processSelectOption,
  processSetFieldSize,
} from './processors';
import { getPromptForInputStep } from './getPromptForInputStep';

const commandProcessors: Record<InputStep, CommandProcessor> = {
  initialize: processInitialize,
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
  echo: boolean = true,
): SimulationSetup => {
  return produce(state, (draft) => {
    if (echo) {
      draft.consoleMessages.push(commandString);
    }
    const setupState = commandProcessors[draft.inputStep](
      {
        ...draft,
        consoleMessages: [],
      },
      commandString,
    );
    draft.consoleMessages.push(...setupState.consoleMessages);
    const prompt = getPromptForInputStep(setupState);
    draft.inputStep = setupState.inputStep;
    draft.fieldSize = setupState.fieldSize;
    draft.consoleMessages.push(...prompt);
  });
};
