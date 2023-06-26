import { type State } from '@/types';

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
  },
};
