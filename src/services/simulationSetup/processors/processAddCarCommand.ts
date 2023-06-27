import { produce } from 'immer';
import { withValidation } from './withValidation';
import { type Car, type Field } from '@/types';
import { reportCarList } from '../reporters';

export const processAddCarCommand = withValidation(
  (state, commandString) => {
    const setupState = produce(state, (draft) => {
      const { setup, simulation } = draft;
      setup.inputStep = 'selectOption';
      setup.carToAdd = {
        ...state.setup.carToAdd,
        commands: commandString,
      };
      setup.carToAdd.commands = commandString;
      const fieldSize: Field = {
        width: simulation.field.width,
        height: simulation.field.height,
      };
      const carToAdd = {
        name: setup.carToAdd?.name ?? '',
        x: setup.carToAdd?.x ?? 0,
        y: setup.carToAdd?.y ?? 0,
        direction: setup.carToAdd?.direction ?? 'N',
        commands: setup.carToAdd?.commands ?? '',
      };

      // Check for out of bounds before adding
      if (
        carToAdd.x < 0 ||
        carToAdd.x >= fieldSize.width ||
        carToAdd.y < 0 ||
        carToAdd.y >= fieldSize.height
      ) {
        setup.consoleMessages.push(MESSAGE_ERROR_OUT_OF_BOUNDS);
      } else if (carExists(carToAdd.name, simulation.cars)) {
        setup.consoleMessages.push(MESSAGE_ERROR_CAR_EXISTS);
      } else {
        simulation.cars.push({
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
      setup.consoleMessages.push(reportCarList(simulation.cars));
    });
    return setupState;
  },
  { inputPattern: /^[LRFU]+$/ },
);

const carExists = (name: string, cars: Car[]): boolean => {
  return cars.some((car) => car.name === name);
};

export const MESSAGE_ERROR_OUT_OF_BOUNDS = 'Car is out of bounds';
export const MESSAGE_ERROR_CAR_EXISTS = 'Car with this name already exists';
