import { initialState, useStore } from './store';
import { type Car } from '@/types';

describe('store', () => {
  beforeEach(() => {
    useStore.setState(initialState);
  });

  it('should be initialized with default state', () => {
    const state = useStore.getState();
    state.cars = [];
    expect(state.fieldWidth).toBe(0);
    expect(state.fieldHeight).toBe(0);
  });

  it('should set field width and height', () => {
    const state = useStore.getState();

    state.setFieldBounds(3, 5);

    const newState = useStore.getState();
    expect(newState.fieldWidth).toBe(3);
    expect(newState.fieldHeight).toBe(5);
  });

  it("should add new car and it's commands", () => {
    const state = useStore.getState();
    const expectedCar: Car = {
      name: 'car1',
      facing: 'N',
      x: 1,
      y: 5,
    };
    const expectedCommand = 'FFFRFFRRLFF';

    state.addCar(expectedCar, expectedCommand);

    const newState = useStore.getState();

    expect(newState.cars).toHaveLength(1);
    const actualCar = newState.cars[0];
    expect(actualCar).toEqual(expectedCar);
    expect(newState.carCommands[expectedCar.name]).toBe(expectedCommand);
  });

  it('should not add a car and show an error if the car being added has the same name as an existing car', () => {
    const expectedCar: Car = { name: 'car1', facing: 'N', x: 1, y: 5 };
    const expectedCommand = 'FRRLLFRLLFF';
    useStore.setState({
      ...initialState,
      cars: [expectedCar],
      carCommands: {
        [expectedCar.name]: 'FRRLLFRLLFF',
      },
    });

    const state = useStore.getState();
    state.addCar({ name: 'car1', facing: 'S', x: 4, y: 1 }, 'FFFRFFRRLFF');

    const newState = useStore.getState();
    // Check that there's only 1 car, and it's the first car added, not the second one with duplicate name
    expect(newState.cars).toHaveLength(1);
    const actualCar = newState.cars[0];
    expect(actualCar).toEqual(expectedCar);
    // Check that there is an error message generated
    expect(newState.error).toBe('A car with the name car1 already exists');
    // Check that the command for the first car is not overwritten
    expect(newState.carCommands[expectedCar.name]).toBe(expectedCommand);
  });

  describe('should not add a car if the car is out of bounds', () => {
    [
      { x: 11, y: 5 },
      { x: 5, y: 11 },
      { x: 12, y: 12 },
      { x: -10, y: -10 },
    ].forEach(({ x, y }) => {
      it(`when car position is at (${x}, ${y})`, () => {
        useStore.setState({ fieldWidth: 10, fieldHeight: 10 });
        const state = useStore.getState();

        state.addCar({ name: 'car1', facing: 'N', x: 11, y: 5 }, 'FFFRFFRRLFF');

        const newState = useStore.getState();
        expect(newState.cars).toHaveLength(0);
        expect(newState.error).toBe('Car is out of bounds');
      });
    });
  });
});
