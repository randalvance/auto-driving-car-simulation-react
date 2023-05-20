import { type Direction } from '@/types';

export const getRotationBasedOnDirection = (direction: Direction): number => {
  switch (direction) {
    case 'N':
      return 0;
    case 'E':
      return 90;
    case 'W':
      return 270;
    case 'S':
      return 180;
  }
};
