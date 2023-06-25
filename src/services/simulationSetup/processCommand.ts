import { produce } from 'immer';
import { type State, type InputStep } from '@/types';
import { type CommandProcessor } from './types';
import {
  processAddCarCommand,
  processAddCarName,
  processAddCarPosition,
  processInitialize,
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
  runningSimulation: (state) => ({ ...state, inputStep: 'simulationComplete' }),
  simulationComplete: processSimulationComplete,
  exit: (state) => state,
};

/** Parses and performs the commandString. Behavior is based on the inputStep of the state. */
export const processCommand = (
  state: State,
  commandString: string,
  echo: boolean = true,
): State => {
  return produce(state, (draft) => {
    const { setup } = draft;
    if (echo) {
      setup.consoleMessages.push(commandString);
    }
    const setupState = commandProcessors[setup.inputStep](
      {
        ...setup,
        consoleMessages: [],
      },
      commandString,
    );

    setup.inputStep = setupState.inputStep;
    setup.fieldSize = setupState.fieldSize;
    setup.cars = setupState.cars;
    setup.carToAdd = setupState.carToAdd;
    setup.consoleMessages.push(...setupState.consoleMessages);

    const prompt = getPromptForInputStep(setupState);
    setup.consoleMessages.push(...prompt);

    draft.simulation.field = setup.fieldSize ?? {
      width: 0,
      height: 0,
    };

    // Transfer the cars from the setup into the simulation.
    if (state.setup.inputStep === 'addCarCommands') {
      draft.simulation.cars = setup.cars ?? [];
    }
  });
};
