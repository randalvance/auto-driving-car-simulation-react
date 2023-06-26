import { produce } from 'immer';
import { type CommandProcessor } from '../types';
import { reportCarCollisions, reportCarList } from '../reporters';

export const processRunningSimulation: CommandProcessor = (state) =>
  produce(state, (draft) => {
    draft.inputStep = 'simulationComplete';
    draft.consoleMessages = [
      reportCarList(draft.cars),
      reportCarCollisions(draft.cars),
    ];
  });
