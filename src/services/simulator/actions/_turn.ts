import { type Car, type Direction } from '@/types';

export const _turn = (
  car: Car,
  directionMap: Record<Direction, Direction>,
): Car => {
  const newDirection = directionMap[car.direction];
  return {
    ...car,
    direction: newDirection,
  };
};
