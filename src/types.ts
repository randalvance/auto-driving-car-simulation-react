export interface State {
  setup: SimulationSetup;
  simulation: Simulation;
}

export interface Actions {
  simulateNextStep: () => void;
  reset: () => void;
  dispatchCommand: (command: string, echo?: boolean) => void;
}

export type Direction = 'N' | 'E' | 'W' | 'S';

export type Command = 'F' | 'L' | 'R' | 'U';

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
  moveHistory: string;
  historyCursor: number;
  collisionInfo?: CollisionInfo[];
}

export interface CollisionInfo {
  carName: Car['name'];
  step: number;
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
  | 'runningSimulation'
  | 'simulationComplete'
  | 'exit';

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
  cars: Car[];
}
