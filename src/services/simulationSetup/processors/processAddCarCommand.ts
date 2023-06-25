import { produce } from 'immer';
import { withValidation } from './withValidation';

export const processAddCarCommand = withValidation(
  (state, commandString) => {
    const setupState = produce(state, (draft) => {
      draft.inputStep = 'selectOption';
      draft.carToAdd = {
        ...state.carToAdd,
        commands: commandString,
      };
      draft.carToAdd.commands = commandString;
    });
    return setupState;
  },
  { inputPattern: /^[LRF]+$/ },
);
