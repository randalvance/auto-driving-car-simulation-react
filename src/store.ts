import { type Car } from '@/types';
import { create } from 'zustand';

export interface State {
  cars: Car[];
  fieldWidth: number;
  fieldHeight: number;
  error?: string;
}

export interface Actions {
  addCar: (car: Car) => void;
  setFieldBounds: (width: number, height: number) => void;
}

export const initialState: State = {
  cars: [],
  fieldWidth: 0,
  fieldHeight: 0,
};

export const useStore = create<State & Actions>((set) => ({
  ...initialState,

  // Actions
  addCar: (car: Car) => {
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
