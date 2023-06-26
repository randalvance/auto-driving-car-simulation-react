import { produce } from 'immer';
import { type CommandProcessor } from '../types';
import { withValidation } from './withValidation';

export const processSimulationComplete: CommandProcessor = withValidation(
  (state, commandString) => {
    const option = +commandString;
    const setupState = produce(state, (draft) => {
      if (option === 1) {
        draft.setup.inputStep = 'initialize';
      } else {
        draft.setup.inputStep = 'exit';
      }
    });
    return setupState;
  },
  { inputPattern: /^([12])$/ },
);
