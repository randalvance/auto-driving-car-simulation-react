import { type Car } from '@/types';

export const _isCarComplete = (car: Car): boolean => {
  return (
    car.commandCursor >= car.commands.length ||
    (car.collisionInfo?.length ?? 0) > 0
  );
};
