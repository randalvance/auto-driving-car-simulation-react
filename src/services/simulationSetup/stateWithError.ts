import { type State } from '@/types';
import { produce } from 'immer';

export const stateWithError = (state: State, ...errors: string[]): State => {
  return produce(state, (draft) => {
    draft.setup.consoleMessages.push(...errors);
  });
};
