import {
  type Car,
  type CollisionInfo,
  type Command,
  type Direction,
  type Stage,
} from '@/types';
import { create } from 'zustand';
import {
  MESSAGE_LIST_OF_CAR,
  MESSAGES_END_OPTIONS,
  MESSAGES_SELECT_OPTION,
} from '@/constants';

export interface State {
  cars: Car[];
  fieldWidth: number;
  fieldHeight: number;
  error?: string;
  carCommands: Record<Car['name'], Command[]>;
  step: number;
  collisions: CollisionInfo[];
  completedCars: Set<string>;
  consoleMessages: string[];
  stage: Stage;
  originalCarPositions: Record<
    Car['name'],
    { x: number; y: number; facing: Direction }
  >;
  carToBeAdded: {
    name?: Car['name'];
    initialPosition?: { x: number; y: number; facing: Direction };
    commands?: Command[];
  };
}

export interface Actions {
  setFieldBounds: (width: number, height: number) => void;
  nextStep: () => void;
  reset: () => void;
  dispatchCommand: (command: string) => void;
}

export const initialState: State = {
  cars: [],
  fieldWidth: 0,
  fieldHeight: 0,
  carCommands: {},
  step: 0,
  collisions: [],
  completedCars: new Set<string>(),
  consoleMessages: [
    'Welcome to Auto Driving Car Simulation!',
    'Please enter the enter the width and height of the simulation field in x and y format:',
  ],
  stage: 'setFieldSize',
  carToBeAdded: {},
  error: undefined,
  originalCarPositions: {},
};

export const useStore = create<State & Actions>((set) => ({
  ...initialState,

  setFieldBounds: (width: number, height: number) => {
    set(() => ({
      fieldWidth: width,
      fieldHeight: height,
    }));
  },
  nextStep: () => {
    set((state) => {
      const {
        cars,
        step,
        fieldWidth,
        fieldHeight,
        carCommands,
        completedCars: currentCompletedCars,
        collisions,
      } = state;
      let movementPerformed = false;

      // All cars are completed, so don't do anything
      if (cars.length === currentCompletedCars.size) {
        return state;
      }

      const newStep = state.step + 1;
      const completedCars: Set<string> = new Set<string>(currentCompletedCars);
      const carPositions: Record<Car['name'], Car> = cars.reduce<
        Record<Car['name'], Car>
      >((acc, car) => {
        acc[car.name] = car;
        return acc;
      }, {});
      const newCollisions: CollisionInfo[] = [...collisions];

      for (let i = 0; i < cars.length; i++) {
        const car = cars[i];
        const commandsForCar = carCommands[car.name];
        const commandAtStep = commandsForCar[step];

        if (completedCars.has(car.name) || commandAtStep === undefined) {
          completedCars.add(car.name);
          continue;
        }
        let carAtNewPosition = car;

        // If a car is not yet complete, check for collisions on it's next move
        if (!currentCompletedCars.has(car.name)) {
          carAtNewPosition = getCarAtNewPosition(car, commandAtStep, {
            width: fieldWidth,
            height: fieldHeight,
          });

          carPositions[car.name] = carAtNewPosition;

          // Check for all cars that collided with carAtNewPosition
          const collidedCars = Object.values(carPositions).filter(
            (anotherCar) => {
              return (
                anotherCar.name !== carAtNewPosition.name &&
                carAtNewPosition.x === anotherCar.x &&
                carAtNewPosition.y === anotherCar.y
              );
            },
          );

          const addCollision = (
            carWhichCollided: Car,
            collidedCars: string[],
          ): void => {
            const currentCollision = newCollisions.find(
              (c) => c.carName === carWhichCollided.name,
            );
            if (currentCollision == null) {
              newCollisions.push({
                carName: carWhichCollided.name,
                collidedWith: collidedCars,
                step: newStep,
                x: carWhichCollided.x,
                y: carWhichCollided.y,
              });
            } else {
              currentCollision.collidedWith = [
                ...currentCollision.collidedWith,
                ...collidedCars,
              ];
            }
            completedCars.add(carWhichCollided.name);
          };

          // If there are collisions, add them to the newCollisions object
          if (collidedCars.length > 0) {
            // Register collisions for the current car
            addCollision(
              carAtNewPosition,
              collidedCars.map((c) => c.name),
            );

            // Also register for other cars that this current car have collided with
            for (const anotherCar of collidedCars) {
              addCollision(anotherCar, [carAtNewPosition.name]);
            }
          }
        }

        movementPerformed = true;
      }

      const isDone = completedCars.size === cars.length;

      return {
        cars: Object.values(carPositions),
        step: movementPerformed ? newStep : step,
        collisions: [...newCollisions],
        completedCars,
        stage: isDone ? 'done' : state.stage,
        consoleMessages: isDone
          ? getReportMessages({ ...state, collisions: [...newCollisions] })
          : state.consoleMessages,
      };
    });
  },
  reset: () => {
    set({
      ...initialState,
    });
  },
  dispatchCommand: (command: string) => {
    set((state) => {
      const commandProcessors: Record<
        Stage,
        typeof processCommandAddCarCommand
      > = {
        setFieldSize: processCommandSetFieldSize,
        selectOption: processCommandSelectOption,
        'addCars-name': processCommandAddCarName,
        'addCars-position': processCommandAddCarPosition,
        'addCars-command': processCommandAddCarCommand,
        runSimulation: (_, state) => state,
        done: (_, state) => state,
      };
      const commandProcessor = commandProcessors[state.stage];
      if (commandProcessor !== undefined) {
        return commandProcessor(command, state);
      }

      return state;
    });
  },
}));

const getCarAtNewPosition = (
  car: Car,
  command: Command,
  bounds: { width: number; height: number },
): Car => {
  if (command === 'F') {
    return moveForward(car, bounds);
  }
  if (command === 'R') {
    return turnRight(car);
  }
  if (command === 'L') {
    return turnLeft(car);
  }
  return car;
};

const moveForward = (
  car: Car,
  bounds: { width: number; height: number },
): Car => {
  if (car.facing === 'N') {
    return { ...car, y: Math.min(car.y + 1, bounds.height) };
  }
  if (car.facing === 'S') {
    return { ...car, y: Math.max(car.y - 1, 0) };
  }
  if (car.facing === 'E') {
    return { ...car, x: Math.min(car.x + 1, bounds.width) };
  }
  if (car.facing === 'W') {
    return { ...car, x: Math.max(car.x - 1, 0) };
  }
  return car;
};

const turnRight = (car: Car): Car => {
  const directionMap: Record<Direction, Direction> = {
    N: 'E',
    E: 'S',
    S: 'W',
    W: 'N',
  };
  return { ...car, facing: directionMap[car.facing] };
};

const turnLeft = (car: Car): Car => {
  const directionMap: Record<Direction, Direction> = {
    N: 'W',
    W: 'S',
    S: 'E',
    E: 'N',
  };
  return { ...car, facing: directionMap[car.facing] };
};

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
        Record<Car['name'], { x: number; y: number; facing: Direction }>
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

  const newCar: Car = {
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

const validateAddingOfCar = (state: State, car: Car): string | null => {
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

const getCollisionMessages = (state: State): string[] => {
  return [
    'After simulation, the result is:',
    ...(state.collisions.map(
      (c) =>
        `- ${c.carName}, collides with ${c.collidedWith.join()} at (${c.x}, ${
          c.y
        }) at step ${c.step}`,
    ) ?? []),
  ];
};

const getReportMessages = (state: State): string[] => {
  return [
    ...state.consoleMessages,
    ...getCurrentListOfCarMessages(state),
    ...getCollisionMessages(state),
    ...MESSAGES_END_OPTIONS,
  ];
};
