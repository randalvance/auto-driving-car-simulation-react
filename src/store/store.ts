import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import * as simulationSetup from '@/services/simulationSetup';
import { isSimulationComplete, simulate } from '@/services/simulator';
import { type Actions, type State } from '@/types';
import { initialState } from './initialState';

export const useStore = create(
  immer<State & Actions>((set, get) => ({
    ...initialState,
    simulateNextStep: () => {
      set((state) => {
        state.simulation = simulate(state.simulation);
      });
      const isComplete = isSimulationComplete(get().simulation);
      if (isComplete) {
        set((state) => {
          state.setup.cars = state.simulation.cars;
        });
        get().dispatchCommand('complete', false);
      }
    },
    reset: () => {
      set({ ...initialState });
      get().dispatchCommand('reset', false);
    },
    dispatchCommand: (command: string, echo?: boolean) => {
      set((state) => {
        state.setup = simulationSetup.processCommand(
          state.setup,
          command,
          echo ?? true,
        );

        state.simulation.field = state.setup.fieldSize ?? {
          width: 0,
          height: 0,
        };
        state.simulation.cars = state.setup.cars ?? [];
      });
    },
  })),
);
