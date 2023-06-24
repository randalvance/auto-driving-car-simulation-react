import { produce } from 'immer';
import { type Direction } from '@/types';
import { type CommandProcessor } from '../types';
import { withValidation } from './withValidation';

export const processAddCarPosition: CommandProcessor = withValidation(
  (state, commandString) => {
    const [x, y, direction] = commandString.split(' ');

    const setupState = produce(state, (draft) => {
      draft.inputStep = 'addCarCommands';
      draft.carToAdd = {
        ...state.carToAdd,
        x: parseInt(x, 10),
        y: parseInt(y, 10),
        direction: direction as Direction,
      };
    });

    return { setupState, errors: [] };
  },
  { inputPattern: /^(\d+) (\d+) ([NSEW])$/ },
);
