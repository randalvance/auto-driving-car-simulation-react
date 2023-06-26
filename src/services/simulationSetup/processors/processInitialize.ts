import { produce } from 'immer';
import { type CommandProcessor } from '../types';
import { MESSAGE_INTRO } from '@/constants';

export const processInitialize: CommandProcessor = (state) => {
  return produce(state, (draft) => {
    draft.setup.inputStep = 'setFieldSize';
    draft.setup.consoleMessages = [MESSAGE_INTRO];
  });
};
