import {
  type Car,
  type CollisionInfo,
  type Command,
  type Direction,
  type Stage,
} from '@/types';
import { create } from 'zustand';

export interface State {
  cars: Car[];
  fieldWidth: number;
  fieldHeight: number;
  error?: string;
  carCommands: Record<Car['name'], Command[]>;
  step: number;
  collisions: CollisionInfo[];
  completedCars: Set<string>;
  isGameOver: boolean;
  consoleMessages: string[];
  stage: Stage;
}

export interface Actions {
  addCar: (car: Car, commands: Command[]) => void;
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
  isGameOver: false,
  consoleMessages: [
    'Welcome to Auto Driving Car Simulation!',
    'Please enter the enter the width and height of the simulation field in x and y format:',
  ],
  stage: 'setFieldSize',
};

export const useStore = create<State & Actions>((set) => ({
  ...initialState,

  // Actions
  addCar: (car: Car, commands: Command[]) => {
    set((state) => {
      // Check whether the car being added has a duplicate name and if so, set error message
      const duplicateCar = state.cars.find((c) => c.name === car.name);

      if (duplicateCar != null) {
        return {
          error: `A car with the name ${car.name} already exists`,
        };
      }

      // Check if the car being added is outside the bounds of the field
      if (
        car.x < 0 ||
        car.x > state.fieldWidth ||
        car.y < 0 ||
        car.y > state.fieldHeight
      ) {
        return {
          error: `Car is out of bounds`,
        };
      }

      return {
        cars: [...state.cars, car],
        carCommands: {
          ...state.carCommands,
          [car.name]: commands,
        },
      };
    });
  },
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

      return {
        cars: Object.values(carPositions),
        step: movementPerformed ? newStep : step,
        collisions: [...newCollisions],
        completedCars,
        isGameOver: completedCars.size === cars.length,
      };
    });
  },
  reset: () => {
    set({
      ...initialState,
    });
  },
  dispatchCommand: (command: string) => {},
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
