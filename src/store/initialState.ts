import { type State } from '@/types';

export const initialState: State = {
  setup: {
    inputStep: 'initialize',
    consoleMessages: [],
  },
  simulation: {
    cars: [],
    field: {
      width: 0,
      height: 0,
    },
  },
};
