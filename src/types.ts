export interface Car {
  name: string;
  x: number;
  y: number;
  facing: Direction;
}
export type Direction = 'N' | 'E' | 'W' | 'S';

export type Command = 'F' | 'L' | 'R';

export interface CollisionInfo {
  carName: Car['name'];
  collidedWith: Array<Car['name']>;
  x: number;
  y: number;
  step: number;
}

export type Stage =
  | 'setFieldSize'
  | 'selectOption'
  | 'addCars-name'
  | 'addCars-position'
  | 'addCars-command'
  | 'runSimulation'
  | 'done';
