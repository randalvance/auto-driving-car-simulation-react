import { vitest } from 'vitest';
import { processRunningSimulation } from './processRunningSimulation';

import { reportCarList } from './reportCarList';
import { type InputStep } from '@/types';

vitest.mock('./reportCarList', () => ({
  reportCarList: vitest.fn(),
}));
const mockedReportCarList = vitest.mocked(reportCarList);

it('should return correct state', () => {
  const mockedCarListReport = 'Car List';
  mockedReportCarList.mockReturnValueOnce(mockedCarListReport);

  const state = processRunningSimulation(
    {
      inputStep: 'runningSimulation',
      fieldSize: {
        width: 10,
        height: 10,
      },
      cars: [],
      consoleMessages: [],
    },
    '',
  );

  expect(state.consoleMessages).toEqual([mockedCarListReport]);
  expect(state.inputStep).toEqual('simulationComplete' satisfies InputStep);
});
