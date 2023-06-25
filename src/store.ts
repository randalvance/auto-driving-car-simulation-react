import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { type SimulationSetup, type Simulation } from '@/types';
import * as simulationSetup from './services/simulationSetup';
import { simulate } from './services/simulator';

export interface State {
  setup: SimulationSetup;
  simulation: Simulation;
}

export interface Actions {
  simulateNextStep: () => void;
  reset: () => void;
  dispatchCommand: (command: string, echo?: boolean) => void;
}

export const initialState: State = {
  setup: {
    inputStep: 'initialize',
    consoleMessages: [],
    cars: [],
  },
  simulation: {
    cars: [],
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
