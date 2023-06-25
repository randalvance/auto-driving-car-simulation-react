import {
  type SimulationSetup,
  type CarLegacy,
  type CollisionInfoLegacy,
  type Command,
  type Direction,
  type Stage,
  type Simulation,
} from '@/types';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import {
  MESSAGE_GOODBYE,
  MESSAGE_LIST_OF_CAR,
  MESSAGES_END_OPTIONS,
  MESSAGES_SELECT_OPTION,
} from '@/constants';
import * as simulationSetup from './services/simulationSetup';
import { simulate } from './services/simulator';

export interface State {
  cars: CarLegacy[];
  fieldWidth: number;
  fieldHeight: number;
  error?: string;
  carCommands: Record<CarLegacy['name'], Command[]>;
  step: number;
  collisions: CollisionInfoLegacy[];
  completedCars: Set<string>;
  stage: Stage;
  originalCarPositions: Record<
    CarLegacy['name'],
    { x: number; y: number; facing: Direction }
  >;
  carToBeAdded: {
    name?: CarLegacy['name'];
    initialPosition?: { x: number; y: number; facing: Direction };
    commands?: Command[];
  };
  isDone: boolean;

  setup: SimulationSetup;
  simulation: Simulation;
}

export interface Actions {
  setFieldBounds: (width: number, height: number) => void;
  simulateNextStep: () => void;
  reset: () => void;
  dispatchCommand: (command: string, echo?: boolean) => void;
}

export const initialState: State = {
  cars: [],
  fieldWidth: 0,
  fieldHeight: 0,
  carCommands: {},
  step: 0,
  collisions: [],
  completedCars: new Set<string>(),
  stage: 'runSimulation',
  carToBeAdded: {},
  error: undefined,
  originalCarPositions: {},
  isDone: false,

  setup: {
    inputStep: 'initialize',
    consoleMessages: [],
  },
  simulation: {
    cars: [
      // {
      //   name: 'car1',
      //   x: 9,
      //   y: 0,
      //   direction: 'N',
      //   commands: 'FRUU',
      //   commandCursor: 0,
      //   moveHistory: '',
      //   historyCursor: 0,
      // },
      // {
      //   name: 'car2',
      //   x: 0,
      //   y: 9,
      //   direction: 'S',
      //   commands: 'FFF',
      //   commandCursor: 0,
      //   moveHistory: '',
      //   historyCursor: 0,
      // },
    ],
    field: {
      width: 0,
      height: 0,
    },
    step: 0,
  },
};

export const useStore = create(
  immer<State & Actions>((set, get) => ({
    ...initialState,

    setFieldBounds: (width: number, height: number) => {
      set((state) => {
        state.fieldWidth = width;
        state.fieldHeight = height;
      });
    },
    simulateNextStep: () => {
      set((state) => {
        const newSimulationState = simulate(state.simulation);
        state.simulation = newSimulationState;
      });
    },
    reset: () => {
      set({ ...initialState });
      get().dispatchCommand('', false);
    },
    dispatchCommand: (command: string, echo?: boolean) => {
      set((state) => {
        const setup = simulationSetup.processCommand(
          state.setup,
          command,
          echo ?? true,
        );

        state.setup = setup;

        state.simulation.field = state.setup.fieldSize ?? {
          width: 0,
          height: 0,
        };
        state.simulation.cars = state.setup.cars ?? [];
      });
    },
  })),
);

const processCommandSetFieldSize = (
  command: string,
  state: State,
): Partial<State> => {
  const tokens = command.split(' ');
  if (
    tokens.length < 2 ||
    tokens.length > 2 ||
    !tokens.every((t) => t.match(/^(\d+)$/))
  ) {
    return {
      consoleMessages: [
        ...state.consoleMessages,
        command,
        'Invalid format. Valid format is x y.',
        'Please enter the enter the width and height of the simulation field in x and y format:',
      ],
    };
  }
  const [width, height] = tokens.map((x) => parseInt(x, 10));

  return {
    fieldWidth: width,
    fieldHeight: height,
    stage: 'selectOption',
    consoleMessages: getOptionsMessage(state, command),
  };
};

const processCommandSelectOption = (
  command: string,
  state: State,
): Partial<State> => {
  if (command.match(/^([1-2])$/) == null) {
    return {
      consoleMessages: getOptionsMessage(state, command, ['Invalid option.']),
    };
  }
  const option = parseInt(command, 10);

  if (option === 1) {
    return {
      stage: 'addCars-name',
      consoleMessages: [
        ...state.consoleMessages,
        command,
        'Please enter the name of the car:',
      ],
    };
  }

  if (option === 2) {
    return {
      stage: 'runSimulation',
      originalCarPositions: state.cars.reduce<
        Record<CarLegacy['name'], { x: number; y: number; facing: Direction }>
      >((acc, car) => {
        acc[car.name] = {
          x: car.x,
          y: car.y,
          facing: car.facing,
        };
        return acc;
      }, {}),
      consoleMessages: [
        ...state.consoleMessages,
        command,
        'Running simulation...',
      ],
    };
  }

  return state;
};

const processCommandAddCarName = (
  command: string,
  state: State,
): Partial<State> => {
  return {
    stage: 'addCars-position',
    consoleMessages: [
      ...state.consoleMessages,
      command,
      `Please enter initial position of car ${command} in x y Direction format:`,
    ],
    carToBeAdded: {
      ...state.carToBeAdded,
      name: command,
    },
  };
};

const processCommandAddCarPosition = (
  command: string,
  state: State,
): Partial<State> => {
  if (command.trim().match(/^(\d+) (\d+) ([NSEW])$/) == null) {
    return {
      consoleMessages: [
        ...state.consoleMessages,
        command,
        'Invalid format. Valid format is x y Direction.',
        `Please enter initial position of car ${
          state.carToBeAdded.name ?? ''
        } in x y Direction format:`,
      ],
    };
  }

  const [x, y, facing] = command.split(' ');
  return {
    stage: 'addCars-command',
    consoleMessages: [
      ...state.consoleMessages,
      command,
      'Please enter the commands for car car1:',
    ],
    carToBeAdded: {
      ...state.carToBeAdded,
      initialPosition: {
        x: parseInt(x, 10),
        y: parseInt(y, 10),
        facing: facing as Direction,
      },
    },
  };
};

const processCommandAddCarCommand = (
  command: string,
  state: State,
): Partial<State> => {
  const commands = command.split('') as Command[];

  if (!commands.every((c) => c.match(/^[LRF]$/) != null)) {
    return {
      consoleMessages: [
        ...state.consoleMessages,
        command,
        'Invalid format. Valid format is a string of commands (F, L, R).',
        `Please enter the commands for car ${state.carToBeAdded.name ?? ''}:`,
      ],
    };
  }

  const newCar: CarLegacy = {
    name: state.carToBeAdded.name ?? '',
    x: state.carToBeAdded.initialPosition?.x ?? 0,
    y: state.carToBeAdded.initialPosition?.y ?? 0,
    facing: state.carToBeAdded.initialPosition?.facing ?? 'N',
  };
  const validationError = validateAddingOfCar(state, newCar);

  if (validationError != null) {
    return {
      stage: 'selectOption',
      consoleMessages: getOptionsMessage(state, command, [validationError]),
    };
  }

  const newCarList = [...state.cars, newCar];
  const newCarCommands = {
    ...state.carCommands,
    [newCar.name]: commands,
  };

  return {
    stage: 'selectOption',
    cars: newCarList,
    carToBeAdded: {
      commands,
    },
    carCommands: newCarCommands,
    consoleMessages: getOptionsMessage(
      {
        ...state,
        cars: newCarList,
        carCommands: newCarCommands,
      },
      command,
    ),
  };
};

const processCommandReset = (command: string, state: State): Partial<State> => {
  if (command.match(/^([1-2])$/) == null) {
    return {
      consoleMessages: [
        ...state.consoleMessages,
        command,
        'Invalid input',
        ...MESSAGES_END_OPTIONS,
      ],
    };
  }
  const option = parseInt(command, 10);
  if (option === 1) {
    return {
      ...initialState,
    };
  }
  if (option === 2) {
    return {
      isDone: true,
      consoleMessages: [...state.consoleMessages, MESSAGE_GOODBYE],
    };
  }
  return state;
};

const validateAddingOfCar = (state: State, car: CarLegacy): string | null => {
  for (const c of state.cars) {
    if (c.name === car.name) {
      return 'Car with the same name already exists';
    }
    if (c.x === car.x && c.y === car.y) {
      return 'Car at the same initial position already exists';
    }
  }
  // Check if the car being added is outside the bounds of the field
  if (
    car.x < 0 ||
    car.x > state.fieldWidth - 1 ||
    car.y < 0 ||
    car.y > state.fieldHeight - 1
  ) {
    return 'Car is out of bounds';
  }
  return null;
};

const getCurrentListOfCarMessages = (state: State): string[] => {
  return [
    MESSAGE_LIST_OF_CAR,
    ...state.cars.map((car) => {
      const commandForCar = state.carCommands[car.name];
      const originalPosition = state.originalCarPositions[car.name] ?? car;
      return `- ${car.name}, (${originalPosition.x}, ${originalPosition.y}) ${
        originalPosition.facing
      }, ${commandForCar?.join('')}`;
    }),
  ];
};

const getOptionsMessage = (
  state: State,
  command: string,
  extraMessages: string[] = [],
): string[] => {
  return [
    ...state.consoleMessages,
    command,
    ...extraMessages,
    ...(state.cars.length > 0 ? getCurrentListOfCarMessages(state) : []),
    ...MESSAGES_SELECT_OPTION,
  ];
};

const getReportMessages = (state: State): string[] => {
  return [
    ...state.consoleMessages,
    ...getCurrentListOfCarMessages(state),
    'After simulation, the result is:',
    ...state.cars.map((car) => {
      // Check whether car collided
      const collision = state.collisions.find((c) => c.carName === car.name);
      if (collision != null) {
        return `- ${
          collision.carName
        }, collides with ${collision.collidedWith.join()} at (${collision.x}, ${
          collision.y
        }) at step ${collision.step}`;
      }
      return `- ${car.name}, (${car.x}, ${car.y}) ${car.facing}`;
    }),
    ...MESSAGES_END_OPTIONS,
  ];
};
