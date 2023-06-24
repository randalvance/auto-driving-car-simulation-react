import { type CommandProcessor } from '../types';

export const defaultCommandProcessor: CommandProcessor = (state) => {
  return {
    setupState: state,
    errors: [],
  };
};
