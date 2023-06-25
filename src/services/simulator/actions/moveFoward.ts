import { produce } from 'immer';
import { type Car } from '@/types';
import { _withinFieldCheck } from './_withinFieldCheck';

export const moveForward = _withinFieldCheck(
  (car: Car, _, trackHistory): Car =>
    produce(car, (draft) => {
      if (draft.direction === 'N') {
        draft.y++;
      }
      if (draft.direction === 'E') {
        draft.x++;
      }
      if (draft.direction === 'S') {
        draft.y--;
      }
      if (draft.direction === 'W') {
        draft.x--;
      }

      if (trackHistory ?? true) {
        draft.moveHistory = 'F';
        draft.historyCursor = draft.moveHistory.length - 1;
      }
    }),
);
