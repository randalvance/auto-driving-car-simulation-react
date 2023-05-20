import {
  type Car,
  type CollisionInfo,
  type Command,
  type Direction,
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
}

export interface Actions {
  addCar: (car: Car, commands: Command[]) => void;
  setFieldBounds: (width: number, height: number) => void;
  nextStep: () => void;
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
      const { cars, step, fieldWidth, fieldHeight, carCommands } = state;
      let movementPerformed = false;

      // All cars have collided, this is a no-op
      if (cars.length === state.completedCars.size) {
        return state;
      }

      const newStep = state.step + 1;
      const completedCars: Set<string> = new Set<string>();
      const carPositions: Array<{ oldPosition: Car; newPosition: Car }> = [];

      for (let i = 0; i < cars.length; i++) {
        const car = cars[i];
        const commandsForCar = carCommands[car.name];
        const commandAtStep = commandsForCar[step];
        if (state.completedCars.has(car.name) || commandAtStep === undefined) {
          completedCars.add(car.name);
          carPositions.push({ oldPosition: car, newPosition: car });
          continue;
        }

        carPositions.push({
          oldPosition: car,
          newPosition: getCarAtNewPosition(car, commandAtStep, {
            width: fieldWidth,
            height: fieldHeight,
          }),
        });
        movementPerformed = true;
      }

      const calculatedCollisions = calculateNewCollisions(
        completedCars,
        carPositions,
        newStep,
      );

      const newCompletedCars = new Set<string>([
        ...completedCars,
        ...calculatedCollisions.map((c) => c.carName),
      ]);

      return {
        cars: carPositions.map((c) => c.newPosition),
        step: movementPerformed ? newStep : step,
        collisions: [...state.collisions, ...calculatedCollisions],
        completedCars: newCompletedCars,
        isGameOver: newCompletedCars.size === cars.length,
      };
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

const calculateNewCollisions = (
  completeCars: Set<string>,
  carPositions: Array<{
    oldPosition: Car;
    newPosition: Car;
  }>,
  newStep: number,
): CollisionInfo[] => {
  return carPositions.reduce<CollisionInfo[]>((acc, car) => {
    if (completeCars.has(car.newPosition.name)) return acc;
    const collisionsForCar = carPositions.filter(
      (c) =>
        c.newPosition.name !== car.newPosition.name &&
        c.newPosition.x === car.newPosition.x &&
        c.newPosition.y === car.newPosition.y,
    );

    if (collisionsForCar.length > 0) {
      acc.push({
        carName: car.newPosition.name,
        collidedWith: collisionsForCar.map((c) => c.newPosition.name),
        x: car.newPosition.x,
        y: car.newPosition.y,
        step: newStep,
      });
    }

    return acc;
  }, []);
};
