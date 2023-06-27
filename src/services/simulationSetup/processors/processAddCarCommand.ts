import { produce } from 'immer';
import { withValidation } from './withValidation';
import { type State, type Field } from '@/types';
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

      const errors = validate(state);

      if (errors.length === 0) {
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
      setup.consoleMessages.push(...errors);
      setup.consoleMessages.push(reportCarList(simulation.cars));
    });
    return setupState;
  },
  { inputPattern: /^[LRFU]+$/ },
);

const validate = (state: State): string[] => {
  const { setup, simulation } = state;
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

  const errors: string[] = [];

  if (
    carToAdd.x < 0 ||
    carToAdd.x >= fieldSize.width ||
    carToAdd.y < 0 ||
    carToAdd.y >= fieldSize.height
  ) {
    errors.push(MESSAGE_ERROR_OUT_OF_BOUNDS);
  }

  // Check against existing cars
  for (const car of simulation.cars) {
    if (car.name === carToAdd.name) {
      errors.push(MESSAGE_ERROR_CAR_EXISTS);
    }
    if (car.x === carToAdd.x && car.y === carToAdd.y) {
      errors.push(MESSAGE_ERROR_CAR_AT_SAME_POS_EXISTS);
    }
  }

  return errors;
};

export const MESSAGE_ERROR_OUT_OF_BOUNDS = 'Car is out of bounds';
export const MESSAGE_ERROR_CAR_EXISTS = 'Car with this name already exists';
export const MESSAGE_ERROR_CAR_AT_SAME_POS_EXISTS =
  'Car at this position already exists';
