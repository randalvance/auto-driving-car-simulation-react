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

  it('should add new car', () => {
    const state = useStore.getState();
    const expectedCar: Car = {
      name: 'car1',
      facing: 'N',
      x: 1,
      y: 5,
    };

    state.addCar(expectedCar);

    const newState = useStore.getState();

    expect(newState.cars).toHaveLength(1);
    const actualCar = newState.cars[0];
    expect(actualCar).toEqual(expectedCar);
  });
});
