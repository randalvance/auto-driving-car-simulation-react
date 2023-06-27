import { produce } from 'immer';
import { type CommandProcessor } from '../types';
import { reportCarCollisions, reportCarList } from '../reporters';

export const processRunningSimulation: CommandProcessor = (state) =>
  produce(state, (draft) => {
    draft.setup.inputStep = 'simulationComplete';
    draft.setup.consoleMessages.push(
      ...[
        reportCarList(draft.simulation.cars),
        reportCarCollisions(draft.simulation.cars),
      ],
    );
  });
