import { type Command, type Car, type Direction } from '@/types';
import { produce } from 'immer';

export const _turn = (
  car: Car,
  directionMap: Record<Direction, Direction>,
  command: Command,
  trackHistory?: boolean,
): Car => {
  const newDirection = directionMap[car.direction];
  return produce(car, (draft) => {
    draft.direction = newDirection;
    if (trackHistory ?? true) {
      draft.moveHistory += command;
      draft.historyCursor = draft.moveHistory.length - 1;
    }
  });
};
