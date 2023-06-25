import { produce } from 'immer';
import { type CommandProcessor } from '../types';
import { withValidation } from './withValidation';

export const processSelectOption: CommandProcessor = withValidation(
  (state, commandString) => {
    const option = +commandString;
    const setupState = produce(state, (draft) => {
      if (option === 1) {
        draft.inputStep = 'addCarName';
      } else {
        draft.inputStep = 'runningSimulation';
      }
    });
    return setupState;
  },
  { inputPattern: /^([12])$/ },
);
