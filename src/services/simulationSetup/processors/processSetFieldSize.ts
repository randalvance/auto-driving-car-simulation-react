import { produce } from 'immer';
import { type CommandProcessor } from '../types';
import { stateWithError } from '../stateWithError';
import { withValidation } from './withValidation';

export const processSetFieldSize: CommandProcessor = withValidation(
  (state, commandString) => {
    const tokens = commandString.split(' ');

    const [width, height] = tokens.map((x) => parseInt(x, 10));

    if (width === 0 || height === 0) {
      return stateWithError(state, MESSAGE_ERROR_ZERO_FIELD_SIZE);
    }

    const setupState = produce(state, (draft) => {
      draft.inputStep = 'selectOption';
      draft.fieldSize = {
        width,
        height,
      };
    });

    return setupState;
  },
  { inputPattern: /^(\d+) (\d+)$/ },
);

export const MESSAGE_ERROR_ZERO_FIELD_SIZE = 'Field size cannot be zero';
