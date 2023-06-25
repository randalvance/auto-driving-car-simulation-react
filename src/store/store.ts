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
        return simulate(state);
      });
      const newState = get();
      if (isSimulationComplete(newState.simulation)) {
        get().dispatchCommand('', false);
      }
    },
    reset: () => {
      set({ ...initialState });
      get().dispatchCommand('reset', false);
    },
    dispatchCommand: (command: string, echo?: boolean) => {
      set((state) =>
        simulationSetup.processCommand(state, command, echo ?? true),
      );

      const newState = get();
      if (newState.setup.inputStep === 'initialize') {
        newState.reset();
      }
    },
  })),
);
