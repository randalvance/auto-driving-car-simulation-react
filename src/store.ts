import { type Car } from '@/types';
import { create } from 'zustand';

export interface State {
  cars: Car[];
  fieldWidth: number;
  fieldHeight: number;
}

export interface Actions {
  addCar: (car: Car) => void;
}

export const initialState: State = {
  cars: [],
  fieldWidth: 0,
  fieldHeight: 0,
};

export const useStore = create<State & Actions>((set, get) => ({
  ...initialState,
  addCar: (car: Car) => {},
}));
