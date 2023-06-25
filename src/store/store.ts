import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import * as simulationSetup from '@/services/simulationSetup';
import { simulate } from '@/services/simulator';
import { type Actions, type State } from '@/types';
import { initialState } from './initialState';

export const useStore = create(
  immer<State & Actions>((set, get) => ({
    ...initialState,
    simulateNextStep: () => {
      set((state) => {
        return simulate(state);
      });
    },
    reset: () => {
      set({ ...initialState });
      get().dispatchCommand('reset', false);
    },
    dispatchCommand: (command: string, echo?: boolean) => {
      set((state) =>
        simulationSetup.processCommand(state, command, echo ?? true),
      );
    },
  })),
);
