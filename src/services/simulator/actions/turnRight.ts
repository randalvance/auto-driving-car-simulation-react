import { type Direction } from '@/types';
import { type CarAction } from '../types';
import { _turn } from './_turn';

const directionMap: Record<Direction, Direction> = {
  N: 'E',
  E: 'S',
  S: 'W',
  W: 'N',
};

export const turnRight: CarAction = (car) => _turn(car, directionMap);
