import { type Car } from '@/types';
import { create } from 'zustand';

export interface State {
  cars: Car[];
  fieldWidth: number;
  fieldHeight: number;
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

export const useStore = create<State & Actions>((set, get) => ({
  ...initialState,

  // Actions
  addCar: (car: Car) => {
    set((state) => ({
      cars: [...state.cars, car],
    }));
  },
  setFieldBounds: (width: number, height: number) => {
    set(() => ({
      fieldWidth: width,
      fieldHeight: height,
    }));
  },
}));
