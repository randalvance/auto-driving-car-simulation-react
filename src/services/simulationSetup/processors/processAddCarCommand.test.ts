import { processAddCarCommand } from './processAddCarCommand';

it('should parse command', () => {
  const setupState = processAddCarCommand(
    {
      inputStep: 'addCarCommands',
      carToAdd: {
        name: 'car1',
        x: 0,
        y: 1,
        direction: 'N',
      },
      consoleMessages: [],
    },
    'FLRF',
  );

  expect(setupState.inputStep).toBe('selectOption');
  expect(setupState.carToAdd?.name).toBe('car1');
  expect(setupState.carToAdd?.x).toBe(0);
  expect(setupState.carToAdd?.y).toBe(1);
  expect(setupState.carToAdd?.direction).toBe('N');
  expect(setupState.carToAdd?.commands).toBe('FLRF');
});
