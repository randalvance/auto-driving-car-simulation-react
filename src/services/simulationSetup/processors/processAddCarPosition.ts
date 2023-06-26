import { produce } from 'immer';
import { type Direction } from '@/types';
import { type CommandProcessor } from '../types';
import { withValidation } from './withValidation';

export const processAddCarPosition: CommandProcessor = withValidation(
  (state, commandString) => {
    const [x, y, direction] = commandString.split(' ');

    const setupState = produce(state, (draft) => {
      draft.setup.inputStep = 'addCarCommands';
      draft.setup.carToAdd!.x = parseInt(x, 10);
      draft.setup.carToAdd!.y = parseInt(y, 10);
      draft.setup.carToAdd!.direction = direction as Direction;
    });

    return setupState;
  },
  { inputPattern: /^(\d+) (\d+) ([NSEW])$/ },
);
