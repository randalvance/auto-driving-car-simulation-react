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
      const { step, fieldWidth, fieldHeight, carCommands, collisions } = state;

      const newStep = state.step + 1;
      const carsAtNewPositions = state.cars.map((car) => {
        const commandForCar = carCommands[car.name];
        const commandAtStep = commandForCar[step];

        if (commandAtStep == null) {
          return car;
        }

        // If car has collided, do not move it
        if (collisions.find((c) => c.carName === car.name) != null) {
          return car;
        }

        return getCarAtNewPosition(car, commandAtStep, {
          width: fieldWidth,
          height: fieldHeight,
        });
      });

      return {
        cars: carsAtNewPositions,
        step: newStep,
        collisions: [...state.collisions],
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
