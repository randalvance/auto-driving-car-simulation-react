export interface Car {
  name: string;
  x: number;
  y: number;
  facing: Direction;
}
export type Direction = 'N' | 'E' | 'W' | 'S';

export type Command = 'F' | 'L' | 'R';
