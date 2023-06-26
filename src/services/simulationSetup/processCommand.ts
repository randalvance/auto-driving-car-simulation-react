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
  return produce(state, (draft) => {
    const { setup } = draft;
    if (echo) {
      setup.consoleMessages.push(commandString);
    }
    const newState = commandProcessors[setup.inputStep](
      produce(state, (draft) => {
        draft.setup.consoleMessages = [];
      }),
      commandString,
    );

    setup.inputStep = newState.setup.inputStep;
    setup.fieldSize = newState.setup.fieldSize;
    setup.cars = newState.setup.cars;
    setup.carToAdd = newState.setup.carToAdd;
    setup.consoleMessages.push(...newState.setup.consoleMessages);

    const prompt = getPromptForInputStep(newState.setup);
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
