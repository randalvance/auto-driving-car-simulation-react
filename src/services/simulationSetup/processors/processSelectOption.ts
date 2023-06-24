import { produce } from 'immer';
import { type CommandProcessor } from '../types';
import { withValidation } from './withValidation';

export const processSelectOption: CommandProcessor = withValidation(
  (state, commandString) => {
    const option = +commandString;
    const setupState = produce(state, (draft) => {
      draft.inputStep = option === 1 ? 'addCarName' : 'runningSimulation';
    });
    return { setupState, errors: [] };
  },
  { inputPattern: /^([12])$/ },
);
