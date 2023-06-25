import { type Car } from '@/types';
import { withinFieldCheck } from '../withinFieldCheck';

export const moveForward = withinFieldCheck((car: Car): Car => {
  if (car.direction === 'N') {
    return {
      ...car,
      y: car.y + 1,
      commandCursor: car.commandCursor + 1,
    };
  }
  if (car.direction === 'E') {
    return {
      ...car,
      x: car.x + 1,
      commandCursor: car.commandCursor + 1,
    };
  }
  if (car.direction === 'S') {
    return {
      ...car,
      y: car.y - 1,
      commandCursor: car.commandCursor + 1,
    };
  }
  if (car.direction === 'W') {
    return {
      ...car,
      x: car.x - 1,
      commandCursor: car.commandCursor + 1,
    };
  }
  return car;
});
