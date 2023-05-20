import { type Car } from '@/types';
import { create } from 'zustand';

export interface State {
  cars: Car[];
  fieldWidth: number;
  fieldHeight: number;
  error?: string;
  carCommands: Record<Car['name'], string>;
  step: number;
}

export interface Actions {
  addCar: (car: Car, command: string) => void;
  setFieldBounds: (width: number, height: number) => void;
  nextStep: () => void;
}

export const initialState: State = {
  cars: [],
  fieldWidth: 0,
  fieldHeight: 0,
  carCommands: {},
  step: 0,
};

export const useStore = create<State & Actions>((set) => ({
  ...initialState,

  // Actions
  addCar: (car: Car, command: string) => {
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
          [car.name]: command,
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
    set((state) => ({
      cars: state.cars.map((car) =>
        calculateCarPosition(car, {
          width: state.fieldWidth,
          height: state.fieldHeight,
        }),
      ),
      step: state.step + 1,
    }));
  },
}));

const calculateCarPosition = (
  car: Car,
  bounds: { width: number; height: number },
): Car => {
  if (car.facing === 'N') {
    return { ...car, y: Math.min(car.y + 1, bounds.height) };
  }
  if (car.facing === 'S') {
    return { ...car, y: car.y - 1 };
  }
  return car;
};
