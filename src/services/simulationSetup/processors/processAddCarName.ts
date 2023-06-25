import { produce } from 'immer';
import { type CommandProcessor } from '../types';
import { withValidation } from './withValidation';

export const processAddCarName: CommandProcessor = withValidation(
  (state, commandString) => {
    const setupState = produce(state, (draft) => {
      draft.inputStep = 'addCarPosition';
      draft.carToAdd = { name: commandString };
    });
    return setupState;
  },
);
