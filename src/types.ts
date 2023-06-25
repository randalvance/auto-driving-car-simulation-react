export interface CarLegacy {
  name: string;
  x: number;
  y: number;
  facing: Direction;
}
export type Direction = 'N' | 'E' | 'W' | 'S';

export type Command = 'F' | 'L' | 'R';

export interface CollisionInfoLegacy {
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
  collisionInfo?: CollisionInfo[];
}

export interface CollisionInfo {
  carName: Car['name'];
  step: number;
}

export interface Simulation {
  cars: Car[];
  field: Field;
  step: number;
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
  consoleMessages: string[];
}
