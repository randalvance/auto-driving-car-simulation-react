import {
  MESSAGE_INTRO,
  MESSAGE_PROMPT_CAR_COMMANDS,
  MESSAGE_PROMPT_CAR_NAME,
  MESSAGE_PROMPT_CAR_POSITION,
  MESSAGE_PROMPT_FIELD_SIZE,
  MESSAGE_PROMPT_SELECT_OPTION,
} from '@/constants';
import { type SimulationSetup, type InputStep } from '@/types';

const promptMesssages: Record<InputStep, string[]> = {
  initialize: [MESSAGE_INTRO],
  setFieldSize: [MESSAGE_PROMPT_FIELD_SIZE],
  selectOption: [MESSAGE_PROMPT_SELECT_OPTION],
  addCarName: [MESSAGE_PROMPT_CAR_NAME],
  addCarPosition: [MESSAGE_PROMPT_CAR_POSITION],
  addCarCommands: [MESSAGE_PROMPT_CAR_COMMANDS],
  runningSimulation: [],
};

export const getPromptForInputStep = (setup: SimulationSetup): string[] => {
  const prompts = promptMesssages[setup.inputStep];
  return prompts.map((prompt) =>
    prompt.replace('$carName', setup.carToAdd?.name ?? ''),
  );
};
