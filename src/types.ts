export interface CarLegacy {
  name: string;
  x: number;
  y: number;
  facing: Direction;
}
export type Direction = 'N' | 'E' | 'W' | 'S';

export type Command = 'F' | 'L' | 'R';

export interface CollisionInfo {
  carName: CarLegacy['name'];
  collidedWith: Array<CarLegacy['name']>;
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

export interface Field {
  width: number;
  height: number;
}

export interface Car {
  name: string;
  x: number;
  y: number;
  direction: Direction;
  commands: string;
  commandCursor: number;
}

export interface Simulation {
  cars: Car[];
  field: Field;
}

export type InputStep =
  | 'initialize'
  | 'setFieldSize'
  | 'selectOption'
  | 'addCarName'
  | 'addCarPosition'
  | 'addCarCommands'
  | 'runningSimulation';

export interface SimulationSetup {
  inputStep: InputStep;
  carToAdd?: Partial<{
    name: string;
    x: number;
    y: number;
    direction: Direction;
    commands: string;
  }>;
  fieldSize?: {
    width: number;
    height: number;
  };
}
