import { type Car } from '@/types';

export const _hasCommandsLeft = (car: Car): boolean => {
  return car.commandCursor < car.commands.length;
};
