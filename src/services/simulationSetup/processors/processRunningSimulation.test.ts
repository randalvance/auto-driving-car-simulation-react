import { vitest } from 'vitest';
import { processRunningSimulation } from './processRunningSimulation';

import { reportCarList, reportCarCollisions } from '../reporters';
import { type InputStep } from '@/types';
import { initialState } from '@/store/initialState';

vitest.mock('../reporters', () => ({
  reportCarList: vitest.fn(),
  reportCarCollisions: vitest.fn(),
}));
const mockedReportCarList = vitest.mocked(reportCarList);
const mockedReportCarCollisions = vitest.mocked(reportCarCollisions);

it('should return correct state', () => {
  const mockedCarListReport = 'Car List';
  const mockedCarCollisionsReport = 'Car Collisions List';
  mockedReportCarList.mockReturnValueOnce(mockedCarListReport);
  mockedReportCarCollisions.mockReturnValueOnce(mockedCarCollisionsReport);

  const state = processRunningSimulation(
    {
      ...initialState,
      setup: {
        inputStep: 'runningSimulation',
        fieldSize: {
          width: 10,
          height: 10,
        },
        cars: [],
        consoleMessages: [],
      },
    },
    '',
  );

  expect(state.setup.consoleMessages).toEqual([
    mockedCarListReport,
    mockedCarCollisionsReport,
  ]);
  expect(state.setup.inputStep).toEqual(
    'simulationComplete' satisfies InputStep,
  );
});
