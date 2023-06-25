import { type Direction } from '@/types';
import { type CarAction } from '../types';
import { _turn } from './_turn';

const directionMap: Record<Direction, Direction> = {
  N: 'W',
  E: 'N',
  S: 'E',
  W: 'S',
};

export const turnLeft: CarAction = (car) => _turn(car, directionMap);
