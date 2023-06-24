import { MESSAGE_ERROR_INVALID_FORMAT } from '@/constants';
import { stateWithError } from '../stateWithError';
import { type CommandProcessor } from '../types';

export interface ValidationRules {
  inputPattern?: RegExp;
}

// Validates common rules
export const withValidation = (
  commandProcessor: CommandProcessor,
  validationRules: ValidationRules = {},
): CommandProcessor => {
  return (state, commandString) => {
    if (
      commandString.trim() === '' ||
      (validationRules.inputPattern != null &&
        commandString.match(validationRules.inputPattern) == null)
    ) {
      return stateWithError(state, MESSAGE_ERROR_INVALID_FORMAT);
    }
    return commandProcessor(state, commandString.trim());
  };
};
