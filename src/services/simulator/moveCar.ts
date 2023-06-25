import { produce } from 'immer';
import { type Field, type Car, type Command } from '@/types';
import { moveForward, turnLeft, turnRight } from './actions';
import { type CarAction } from './types';

/** Manages the movement of car based on the car's command and where commandCursor is pointing */
export const moveCar = (car: Car, field: Field): Car => {
  if ((car.collisionInfo?.length ?? 0) > 0) {
    return produce(car, (draft) => {
      draft.commandCursor += 1;
    });
  }
  const command = getCommandAtCursor(car);
  let carAction: CarAction = moveForward;

  if (command === 'R') {
    carAction = turnRight;
  } else if (command === 'L') {
    carAction = turnLeft;
  }

  const carAfterMove = carAction(car, field);
  return produce(carAfterMove, (draft) => {
    draft.commandCursor += 1;
  });
};

const getCommandAtCursor = (car: Car): Command => {
  return car.commands[car.commandCursor] as Command;
};
