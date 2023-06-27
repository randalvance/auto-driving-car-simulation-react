import { produce } from 'immer';
import { type State, type InputStep } from '@/types';
import { type CommandProcessor } from './types';
import {
  processAddCarCommand,
  processAddCarName,
  processAddCarPosition,
  processInitialize,
  processRunningSimulation,
  processSelectOption,
  processSetFieldSize,
  processSimulationComplete,
} from './processors';
import { getPromptForInputStep } from './getPromptForInputStep';

const commandProcessors: Record<InputStep, CommandProcessor> = {
  initialize: processInitialize,
  setFieldSize: processSetFieldSize,
  selectOption: processSelectOption,
  addCarName: processAddCarName,
  addCarPosition: processAddCarPosition,
  addCarCommands: processAddCarCommand,
  runningSimulation: processRunningSimulation,
  simulationComplete: processSimulationComplete,
  exit: (state) => state,
};

/** Parses and performs the commandString. Behavior is based on the inputStep of the state. */
export const processCommand = (
  state: State,
  commandString: string,
  echo: boolean = true,
): State => {
  let newState: State = state;

  if (echo) {
    newState = produce(state, (draft) => {
      draft.setup.consoleMessages.push(commandString);
    });
  }

  // Execute command processor for current inputStep
  newState = commandProcessors[newState.setup.inputStep](
    newState,
    commandString,
  );

  // Get prompt message for whatever step we're on
  const promptMessages = getPromptForInputStep(newState.setup);

  return produce(newState, (draft) => {
    draft.setup.consoleMessages.push(...promptMessages);
  });
};
