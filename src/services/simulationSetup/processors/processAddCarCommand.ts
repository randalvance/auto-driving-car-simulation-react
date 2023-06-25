import { produce } from 'immer';
import { withValidation } from './withValidation';
import { type Field } from '@/types';
import { reportCarList } from './reportCarList';

export const processAddCarCommand = withValidation(
  (state, commandString) => {
    const setupState = produce(state, (draft) => {
      draft.inputStep = 'selectOption';
      draft.carToAdd = {
        ...state.carToAdd,
        commands: commandString,
      };
      draft.carToAdd.commands = commandString;
      const fieldSize: Field = {
        width: draft.fieldSize?.width ?? 0,
        height: draft.fieldSize?.height ?? 0,
      };
      const carToAdd = {
        name: draft.carToAdd?.name ?? '',
        x: draft.carToAdd?.x ?? 0,
        y: draft.carToAdd?.y ?? 0,
        direction: draft.carToAdd?.direction ?? 'N',
        commands: draft.carToAdd?.commands ?? '',
      };

      draft.cars = draft.cars ?? [];
      // Check for out of bounds before adding
      if (
        carToAdd.x < 0 ||
        carToAdd.x >= fieldSize.width ||
        carToAdd.y < 0 ||
        carToAdd.y >= fieldSize.height
      ) {
        draft.consoleMessages.push(MESSAGE_ERROR_OUT_OF_BOUNDS);
      } else {
        draft.cars.push({
          name: draft.carToAdd.name ?? '',
          x: draft.carToAdd.x ?? 0,
          y: draft.carToAdd.y ?? 0,
          direction: draft.carToAdd.direction ?? 'N',
          commands: draft.carToAdd.commands ?? '',
          commandCursor: 0,
          moveHistory: '',
          historyCursor: 0,
        });
      }
      draft.carToAdd = undefined;
      draft.consoleMessages.push(reportCarList(draft.cars));
    });
    return setupState;
  },
  { inputPattern: /^[LRFU]+$/ },
);

export const MESSAGE_ERROR_OUT_OF_BOUNDS = 'Car is out of bounds';
