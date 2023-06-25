import { produce } from 'immer';
import { type CarAction } from '../types';
import { moveBackward } from './moveBackward';
import { turnLeft, turnRight } from '.';

export const undo: CarAction = (car, field) => {
  const lastCommand = car.moveHistory[car.historyCursor];
  let carAfterUndo = car;
  if (lastCommand === 'F') {
    carAfterUndo = moveBackward(car, field);
  } else if (lastCommand === 'R') {
    carAfterUndo = turnLeft(car, field);
  } else if (lastCommand === 'L') {
    carAfterUndo = turnRight(car, field);
  }
  return produce(carAfterUndo, (draft) => {
    draft.commandCursor += 1;
    draft.historyCursor -= 1;
  });
};
