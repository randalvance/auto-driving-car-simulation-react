import { type Car } from '@/types';
import { create } from 'zustand';

export interface State {
  cars: Car[];
  fieldWidth: number;
  fieldHeight: number;
  error?: string;
  carCommands: Record<Car['name'], string>;
}

export interface Actions {
  addCar: (car: Car, command: string) => void;
  setFieldBounds: (width: number, height: number) => void;
}

export const initialState: State = {
  cars: [],
  fieldWidth: 0,
  fieldHeight: 0,
  carCommands: {},
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
}));