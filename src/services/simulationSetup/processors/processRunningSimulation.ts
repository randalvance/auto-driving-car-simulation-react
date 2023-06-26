import { produce } from 'immer';
import { type CommandProcessor } from '../types';
import { reportCarList } from './reportCarList';

export const processRunningSimulation: CommandProcessor = (state) =>
  produce(state, (draft) => {
    draft.inputStep = 'simulationComplete';
    draft.consoleMessages = [reportCarList(draft.cars)];
  });
