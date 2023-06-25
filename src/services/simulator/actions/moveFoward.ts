import { type Car } from '@/types';
import { _withinFieldCheck } from './_withinFieldCheck';

export const moveForward = _withinFieldCheck((car: Car): Car => {
  if (car.direction === 'N') {
    return {
      ...car,
      y: car.y + 1,
    };
  }
  if (car.direction === 'E') {
    return {
      ...car,
      x: car.x + 1,
    };
  }
  if (car.direction === 'S') {
    return {
      ...car,
      y: car.y - 1,
    };
  }
  if (car.direction === 'W') {
    return {
      ...car,
      x: car.x - 1,
    };
  }
  return car;
});
