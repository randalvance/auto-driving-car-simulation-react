import { MESSAGE_INTRO } from '@/constants';
import { processInitialize } from '.';

it('should return correct state', () => {
  const state = processInitialize(
    {
      inputStep: 'initialize',
      consoleMessages: [],
    },
    '',
  );

  expect(state.inputStep).toBe('setFieldSize');
  expect(state.consoleMessages).toEqual([MESSAGE_INTRO]);
});
