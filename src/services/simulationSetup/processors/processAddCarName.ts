import { produce } from 'immer';
import { type CommandProcessor } from '../types';
import { withValidation } from './withValidation';

export const processAddCarName: CommandProcessor = withValidation(
  (state, commandString) => {
    const newState = produce(state, (draft) => {
      draft.setup.inputStep = 'addCarPosition';
      draft.setup.carToAdd = { name: commandString };
    });
    return newState;
  },
);
