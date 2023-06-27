import { MESSAGE_INTRO } from '@/constants';
import { processInitialize } from '.';
import { initialState } from '@/store/initialState';

it('should return correct state', () => {
  const newState = processInitialize(
    {
      ...initialState,
      setup: {
        inputStep: 'initialize',
        consoleMessages: [],
      },
    },
    '',
  );

  expect(newState.setup.inputStep).toBe('setFieldSize');
  expect(newState.setup.consoleMessages).toEqual([MESSAGE_INTRO]);
});
