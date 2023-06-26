import { produce } from 'immer';
import { withValidation } from './withValidation';
import { type Field } from '@/types';
import { reportCarList } from '../reporters';

export const processAddCarCommand = withValidation(
  (state, commandString) => {
    const setupState = produce(state, (draft) => {
      const { setup } = draft;
      setup.inputStep = 'selectOption';
      setup.carToAdd = {
        ...state.setup.carToAdd,
        commands: commandString,
      };
      setup.carToAdd.commands = commandString;
      const fieldSize: Field = {
        width: setup.fieldSize?.width ?? 0,
        height: setup.fieldSize?.height ?? 0,
      };
      const carToAdd = {
        name: setup.carToAdd?.name ?? '',
        x: setup.carToAdd?.x ?? 0,
        y: setup.carToAdd?.y ?? 0,
        direction: setup.carToAdd?.direction ?? 'N',
        commands: setup.carToAdd?.commands ?? '',
      };

      setup.cars = setup.cars ?? [];
      // Check for out of bounds before adding
      if (
        carToAdd.x < 0 ||
        carToAdd.x >= fieldSize.width ||
        carToAdd.y < 0 ||
        carToAdd.y >= fieldSize.height
      ) {
        setup.consoleMessages.push(MESSAGE_ERROR_OUT_OF_BOUNDS);
      } else {
        setup.cars.push({
          name: setup.carToAdd.name ?? '',
          x: setup.carToAdd.x ?? 0,
          y: setup.carToAdd.y ?? 0,
          direction: setup.carToAdd.direction ?? 'N',
          commands: setup.carToAdd.commands ?? '',
          commandCursor: 0,
          moveHistory: '',
          historyCursor: 0,
        });
      }
      setup.carToAdd = undefined;
      setup.consoleMessages.push(reportCarList(setup.cars));
    });
    return setupState;
  },
  { inputPattern: /^[LRFU]+$/ },
);

export const MESSAGE_ERROR_OUT_OF_BOUNDS = 'Car is out of bounds';
