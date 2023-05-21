import { initialState, useStore } from './store';
import {
  type Car,
  type CollisionInfo,
  type Command,
  type Direction,
  type Stage,
} from '@/types';

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
    useStore.setState({ fieldWidth: 10, fieldHeight: 10 });
    const state = useStore.getState();
    const expectedCar: Car = {
      name: 'car1',
      facing: 'N',
      x: 1,
      y: 5,
    };
    const expectedCommand: Command[] = ['F', 'R', 'R', 'L', 'L', 'F', 'R'];

    state.addCar(expectedCar, expectedCommand);

    const newState = useStore.getState();

    expect(newState.cars).toHaveLength(1);
    const actualCar = newState.cars[0];
    expect(actualCar).toEqual(expectedCar);
    expect(newState.carCommands[expectedCar.name]).toBe(expectedCommand);
  });

  it('should not add a car and show an error if the car being added has the same name as an existing car', () => {
    const expectedCar: Car = { name: 'car1', facing: 'N', x: 1, y: 5 };
    const expectedCommand: Command[] = ['F', 'R', 'R', 'L', 'L', 'F', 'R'];
    useStore.setState({
      ...initialState,
      cars: [expectedCar],
      carCommands: {
        [expectedCar.name]: expectedCommand,
      },
    });

    const state = useStore.getState();
    state.addCar({ name: 'car1', facing: 'S', x: 4, y: 1 }, ['F', 'R']);

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

        state.addCar({ name: 'car1', facing: 'N', x: 11, y: 5 }, ['F', 'R']);

        const newState = useStore.getState();
        expect(newState.cars).toHaveLength(0);
        expect(newState.error).toBe('Car is out of bounds');
      });
    });
  });

  describe('Simulation Tests', () => {
    beforeEach(() => {
      useStore.setState({ fieldWidth: 10, fieldHeight: 10, step: 0 });
    });

    describe('should move car forward', () => {
      [
        {
          facing: 'North',
          carPosition: { facing: 'N', x: 0, y: 0 },
          targetPosition: { x: 0, y: 1 },
        },
        {
          facing: 'South',
          carPosition: { facing: 'S', x: 0, y: 5 },
          targetPosition: { x: 0, y: 4 },
        },
        {
          facing: 'East',
          carPosition: { facing: 'E', x: 3, y: 0 },
          targetPosition: { x: 4, y: 0 },
        },
        {
          facing: 'West',
          carPosition: { facing: 'W', x: 3, y: 0 },
          targetPosition: { x: 2, y: 0 },
        },
        // Out of bounds tests (field is 10x10)
        {
          facing: 'North',
          carPosition: { facing: 'N', x: 0, y: 10 },
          targetPosition: { x: 0, y: 10 },
        },
        {
          facing: 'South',
          carPosition: { facing: 'S', x: 0, y: 0 },
          targetPosition: { x: 0, y: 0 },
        },
        {
          facing: 'East',
          carPosition: { facing: 'E', x: 10, y: 0 },
          targetPosition: { x: 10, y: 0 },
        },
        {
          facing: 'West',
          carPosition: { facing: 'W', x: 0, y: 0 },
          targetPosition: { x: 0, y: 0 },
        },
      ].forEach(({ facing, carPosition, targetPosition }) => {
        it(`when facing ${facing}`, () => {
          const car: Car = {
            name: 'car1',
            ...carPosition,
            facing: carPosition.facing as Direction,
          };
          useStore.setState({
            cars: [car],
            carCommands: { [car.name]: ['F'] },
          });
          const state = useStore.getState();

          state.nextStep();

          const newState = useStore.getState();
          expect(newState.cars).toHaveLength(1);
          const actualCar = newState.cars[0];
          expect(actualCar).toEqual({ ...car, ...targetPosition });
          expect(newState.step).toBe(1);
        });
      });
    });

    describe('should change car direction', () => {
      describe('should turn', () => {
        [
          {
            facing: 'N',
            turn: 'Right',
            expectedDirection: 'E',
          },
          {
            facing: 'E',
            turn: 'Right',
            expectedDirection: 'S',
          },
          {
            facing: 'S',
            turn: 'Right',
            expectedDirection: 'W',
          },
          {
            facing: 'W',
            turn: 'Right',
            expectedDirection: 'N',
          },
          {
            facing: 'N',
            turn: 'Left',
            expectedDirection: 'W',
          },
          {
            facing: 'E',
            turn: 'Left',
            expectedDirection: 'N',
          },
          {
            facing: 'S',
            turn: 'Left',
            expectedDirection: 'E',
          },
          {
            facing: 'W',
            turn: 'Left',
            expectedDirection: 'S',
          },
        ].forEach(({ facing, turn, expectedDirection }) => {
          it(`when facing ${facing} and turning ${turn}`, () => {
            // Arrange
            const car: Car = {
              name: 'car1',
              facing: facing as Direction,
              x: 5,
              y: 5,
            };
            useStore.setState({
              fieldWidth: 10,
              fieldHeight: 10,
              cars: [car],
              carCommands: {
                [car.name]: turn === 'Right' ? ['R'] : ['L'],
              },
            });
            const state = useStore.getState();

            // Act
            state.nextStep();

            // Assert
            const newState = useStore.getState();
            expect(newState.cars).toHaveLength(1);
            const actualCar = newState.cars[0];
            // Car should be facing the expected direction
            expect(actualCar.facing).toEqual(expectedDirection);
            // Make sure car stayed in same position
            expect(actualCar.x).toBe(5);
            expect(actualCar.y).toBe(5);
          });
        });
      });
    });

    it('should move two cars at the same time', () => {
      // Arrange
      const car1: Car = {
        name: 'car1',
        facing: 'N',
        x: 0,
        y: 0,
      };
      const car2: Car = {
        name: 'car2',
        facing: 'S',
        x: 10,
        y: 10,
      };
      useStore.setState({
        fieldWidth: 10,
        fieldHeight: 10,
        cars: [car1, car2],
        carCommands: {
          [car1.name]: ['F', 'F', 'R', 'F', 'F', 'L', 'F', 'F', 'F', 'F', 'L'],
          [car2.name]: ['F', 'F', 'R', 'F', 'F', 'L', 'F', 'F'],
        },
      });
      const state = useStore.getState();
      const maxSteps = Math.max(
        ...Object.keys(state.carCommands).map(
          (k) => state.carCommands[k].length,
        ),
      );

      // Act
      for (let i = 0; i < maxSteps; i++) {
        state.nextStep();
      }

      // Assert
      const newState = useStore.getState();
      expect(newState.step).toBe(maxSteps);
      expect(newState.cars).toHaveLength(2);
      const actualCar1 = newState.cars[0];
      const actualCar2 = newState.cars[1];
      // Make sure car stayed in same position
      expect(actualCar1.x).toBe(2);
      expect(actualCar1.y).toBe(6);
      expect(actualCar2.x).toBe(8);
      expect(actualCar2.y).toBe(6);
      // Car should be facing the expected direction
      expect(actualCar1.facing).toEqual('W');
      expect(actualCar2.facing).toEqual('S');
    });

    it('should test collision of multiple cars', () => {
      // Arrange
      useStore.setState({
        cars: [
          { name: 'car1', facing: 'N', x: 0, y: 0 },
          { name: 'car2', facing: 'N', x: 2, y: 0 },
          { name: 'car3', facing: 'W', x: 9, y: 3 },
        ],
        carCommands: {
          car1: ['F', 'F', 'F', 'R', 'F', 'F', 'F', 'F', 'F', 'F'],
          car2: ['F', 'F', 'F', 'L', 'F', 'F', 'F', 'F', 'F', 'F'],
          car3: ['F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F'],
        },
      });
      const state = useStore.getState();
      const maxSteps = Math.max(
        ...Object.keys(state.carCommands).map(
          (k) => state.carCommands[k].length,
        ),
      );

      // Act
      for (let i = 0; i < maxSteps; i++) {
        state.nextStep();
      }

      // Assert
      const newState = useStore.getState();
      // The last car collided at step 8
      expect(newState.step).toBe(8);
      expect(newState.cars).toHaveLength(3);
      const actualCar1 = newState.cars[0];
      const actualCar2 = newState.cars[1];
      const actualCar3 = newState.cars[2];
      // All cars collided in the same position
      expect(actualCar1.x).toBe(1);
      expect(actualCar1.y).toBe(3);
      expect(actualCar1.facing).toBe('E');
      expect(actualCar2.x).toBe(1);
      expect(actualCar2.y).toBe(3);
      expect(actualCar2.facing).toBe('W');
      expect(actualCar3.x).toBe(1);
      expect(actualCar3.y).toBe(3);
      expect(actualCar3.facing).toBe('W');
      // Check Collisions
      expect(newState.collisions).toHaveLength(3);
      const collisionForCar1 = newState.collisions.find(
        (c) => c.carName === actualCar1.name,
      );
      expect(collisionForCar1).toEqual({
        carName: actualCar1.name,
        collidedWith: [actualCar2.name, actualCar3.name],
        x: 1,
        y: 3,
        step: 5,
      } satisfies CollisionInfo);
      const collisionForCar2 = newState.collisions.find(
        (c) => c.carName === actualCar2.name,
      );
      expect(collisionForCar2).toEqual({
        carName: actualCar2.name,
        collidedWith: [actualCar1.name, actualCar3.name],
        x: 1,
        y: 3,
        step: 5,
      } satisfies CollisionInfo);
      const collisionForCar3 = newState.collisions.find(
        (c) => c.carName === actualCar3.name,
      );
      expect(collisionForCar3).toEqual({
        carName: actualCar3.name,
        collidedWith: [actualCar1.name, actualCar2.name],
        x: 1,
        y: 3,
        step: 8,
      } satisfies CollisionInfo);
    });

    it('should set stage to done and completedCars when all cars are crashed', () => {
      // Arrange
      useStore.setState({
        fieldHeight: 10,
        fieldWidth: 10,
        cars: [
          { name: 'car1', facing: 'E', x: 0, y: 5 },
          { name: 'car2', facing: 'W', x: 4, y: 5 },
        ],
        carCommands: {
          car1: ['F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F'],
          car2: ['F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F'],
        },
      });

      const state = useStore.getState();
      const maxSteps = Math.max(
        ...Object.keys(state.carCommands).map(
          (k) => state.carCommands[k].length,
        ),
      );

      // Act
      for (let i = 0; i < maxSteps; i++) {
        state.nextStep();
      }

      // Assert
      const newState = useStore.getState();
      expect(newState.step).toBe(2);
      expect(newState.stage).toBe('done');
      expect(newState.completedCars).toEqual(new Set<string>(['car1', 'car2']));
    });

    it('should set stage to done and completedCars when all cars are complete', () => {
      // Arrange
      useStore.setState({
        fieldHeight: 10,
        fieldWidth: 10,
        cars: [
          { name: 'car1', facing: 'E', x: 0, y: 5 },
          { name: 'car2', facing: 'W', x: 4, y: 5 },
          { name: 'car3', facing: 'S', x: 5, y: 10 },
        ],
        carCommands: {
          car1: ['F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F'],
          car2: ['F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F'],
          car3: ['F', 'F', 'F', 'F', 'F', 'F'],
        },
      });

      const state = useStore.getState();
      const maxSteps = Math.max(
        ...Object.keys(state.carCommands).map(
          (k) => state.carCommands[k].length,
        ),
      );

      // Act
      for (let i = 0; i < maxSteps; i++) {
        state.nextStep();
      }

      // Assert
      const newState = useStore.getState();
      expect(newState.step).toBe(6);
      expect(newState.stage).toBe('done');
      expect(newState.completedCars).toEqual(
        new Set<string>(['car1', 'car2', 'car3']),
      );
    });

    /*
      Let's say car1 is at position (0, 0, 'E') and car2 is at position (1, 0, 'W'),
      on the next step, car1 will move to (1, 0, 'E') and car2 will move to (0, 0, 'W')
      which means the cars phase through each other.
      Since this scenario was not described in the original requirement
      I will just assume that the collision will happen on the original position of the latter car.
      In this case, the collision will happen at (1, 0).
    */
    it('should set collision when two cars are right next to each other', () => {
      // Arrange
      useStore.setState({
        fieldHeight: 10,
        fieldWidth: 10,
        cars: [
          { name: 'car1', facing: 'E', x: 0, y: 0 },
          { name: 'car2', facing: 'W', x: 1, y: 0 },
        ],
        carCommands: {
          car1: ['F'],
          car2: ['F'],
        },
      });
      const state = useStore.getState();

      // Act
      state.nextStep();

      // Assert
      const newState = useStore.getState();
      expect(newState.step).toBe(1);
      expect(newState.completedCars).toEqual(new Set<string>(['car1', 'car2']));
      const car1 = newState.cars[0];
      expect(car1.x).toBe(1);
      expect(car1.y).toBe(0);
      expect(car1.facing).toBe('E');
      const car2 = newState.cars[1];
      expect(car2.x).toBe(1);
      expect(car2.y).toBe(0);
      expect(car2.facing).toBe('W');
      expect(newState.collisions).toEqual([
        {
          carName: 'car1',
          collidedWith: ['car2'],
          step: 1,
          x: 1,
          y: 0,
        } satisfies CollisionInfo,
        {
          carName: 'car2',
          collidedWith: ['car1'],
          step: 1,
          x: 1,
          y: 0,
        } satisfies CollisionInfo,
      ]);
    });
  });

  it('should reset simulation state', () => {
    // Arrange
    useStore.setState({
      stage: 'done',
      consoleMessages: ['Message 1', 'Message 2'],
    });
    const store = useStore.getState();

    // Act
    store.reset();

    // Assert
    const newState = useStore.getState();
    expect(newState.consoleMessages).toEqual([
      'Welcome to Auto Driving Car Simulation!',
      'Please enter the enter the width and height of the simulation field in x and y format:',
    ]);
    expect(newState.stage).toBe('setFieldSize');
    expect(newState.cars.length).toBe(0);
    expect(newState.fieldHeight).toBe(0);
    expect(newState.fieldWidth).toBe(0);
  });

  describe('Dispatching Commands', () => {
    it('should process command for setting field size', () => {
      // Arrange
      const state = useStore.getState();

      // Act
      state.dispatchCommand('5 10');

      // Assert
      const newState = useStore.getState();
      expect(newState.fieldWidth).toBe(5);
      expect(newState.fieldHeight).toBe(10);
      expect(newState.stage).toBe('selectOption' satisfies Stage);
      expect(newState.consoleMessages).toEqual([
        ...state.consoleMessages,
        '5 10',
        'Please choose from the following options:',
        '[1] Add a car to field',
        '[2] Run simulation',
      ]);
    });

    describe('should not process command for setting field if inputs are incorrect', () => {
      ['5 50x', '55555', 'sdfsfsdf', 'a5 5', '5 10 5'].forEach((input) => {
        it(`when input is ${input}`, () => {
          // Arrange
          const state = useStore.getState();

          // Act
          state.dispatchCommand(input);

          // Assert
          const newState = useStore.getState();
          expect(newState.fieldWidth).toBe(0);
          expect(newState.fieldHeight).toBe(0);
          expect(newState.stage).toBe('setFieldSize' satisfies Stage);
          expect(newState.consoleMessages).toEqual([
            ...state.consoleMessages,
            input,
            'Invalid format. Valid format is x y.',
            'Please enter the enter the width and height of the simulation field in x and y format:',
          ]);
        });
      });
    });

    it('should process command for selection option 1', () => {
      // Arrange
      useStore.setState({
        fieldHeight: 10,
        fieldWidth: 10,
        stage: 'selectOption',
      });
      const state = useStore.getState();

      // Act
      state.dispatchCommand('1');

      // Assert
      const newState = useStore.getState();
      expect(newState.stage).toBe('addCars-name' satisfies Stage);
      expect(newState.consoleMessages).toEqual([
        ...state.consoleMessages,
        '1',
        'Please enter the name of the car:',
      ]);
    });

    it('should process command for selection option 2', () => {
      // Arrange
      useStore.setState({
        fieldHeight: 10,
        fieldWidth: 10,
        stage: 'selectOption',
      });
      const state = useStore.getState();

      // Act
      state.dispatchCommand('2');

      // Assert
      const newState = useStore.getState();
      expect(newState.stage).toBe('runSimulation' satisfies Stage);
      expect(newState.consoleMessages).toEqual([
        ...state.consoleMessages,
        '2',
        'Running simulation...',
      ]);
    });

    describe('should process command for selection option, negative cases', () => {
      ['1a', 'a2', 'asdfsdfs', '1 2', '3'].forEach((input) => {
        it(`when input is ${input}`, () => {});
        // Arrange
        useStore.setState({
          fieldHeight: 10,
          fieldWidth: 10,
          stage: 'selectOption',
        });
        const state = useStore.getState();

        // Act
        state.dispatchCommand(input);

        // Assert
        const newState = useStore.getState();
        expect(newState.stage).toBe('selectOption' satisfies Stage);
        expect(newState.consoleMessages).toEqual([
          ...state.consoleMessages,
          input,
          'Invalid option.',
          'Please choose from the following options:',
          '[1] Add a car to field',
          '[2] Run simulation',
        ]);
      });
    });

    describe('Adding a car', () => {
      it('should set the name of the car to be added', () => {
        // Arrange
        useStore.setState({
          stage: 'addCars-name',
        });
        const state = useStore.getState();

        // Act
        state.dispatchCommand('car1');

        // Assert
        const newState = useStore.getState();
        expect(newState.stage).toBe('addCars-position' satisfies Stage);
        expect(newState.carToBeAdded.name).toBe('car1');
        expect(newState.cars.length).toBe(0);
        expect(newState.consoleMessages).toEqual([
          ...state.consoleMessages,
          'car1',
          'Please enter initial position of car car1 in x y Direction format:',
        ]);
      });

      describe('should set the initial position of the car to be added', () => {
        it('when input is valid', () => {
          // Arrange
          useStore.setState({
            stage: 'addCars-position',
            carToBeAdded: {
              name: 'car1',
            },
          });
          const state = useStore.getState();

          // Act
          state.dispatchCommand('1 2 N');

          // Assert
          const newState = useStore.getState();
          expect(newState.stage).toBe('addCars-command' satisfies Stage);
          expect(newState.carToBeAdded.initialPosition).toBeTruthy();
          expect(newState.carToBeAdded.initialPosition!.x).toBe(1);
          expect(newState.carToBeAdded.initialPosition!.y).toBe(2);
          expect(newState.carToBeAdded.initialPosition!.facing).toBe('N');
          expect(newState.cars.length).toBe(0);
          expect(newState.consoleMessages).toEqual([
            ...state.consoleMessages,
            '1 2 N',
            'Please enter the commands for car car1:',
          ]);
        });

        describe('when input is invalid', () => {
          [
            '1 2',
            '1 2 3',
            '1  2  N',
            '1 2 N N',
            '1 2 N 3',
            '1 2 N N N',
          ].forEach((input) => {
            it(`when input is ${input}`, () => {
              // Arrange
              useStore.setState({
                stage: 'addCars-position',
                carToBeAdded: {
                  name: 'car1',
                },
              });
              const state = useStore.getState();

              // Act
              state.dispatchCommand(input);

              // Assert
              const newState = useStore.getState();
              expect(newState.stage).toBe('addCars-position' satisfies Stage);
              expect(newState.carToBeAdded.initialPosition).toBeFalsy();
              expect(newState.cars.length).toBe(0);
              expect(newState.consoleMessages).toEqual([
                ...state.consoleMessages,
                input,
                'Invalid format. Valid format is x y Direction.',
                'Please enter initial position of car car1 in x y Direction format:',
              ]);
            });
          });
        });
      });

      describe('should set the command of the car to be added', () => {
        beforeEach(() => {
          useStore.setState({
            error: undefined,
          });
        });
        it('when input is valid', () => {
          // Arrange
          useStore.setState({
            stage: 'addCars-command',
            fieldWidth: 10,
            fieldHeight: 10,
            carToBeAdded: {
              name: 'car1',
              initialPosition: {
                x: 1,
                y: 2,
                facing: 'N',
              },
            },
          });
          const state = useStore.getState();

          // Act
          state.dispatchCommand('FRFLFFFRLF');

          // Assert
          const newState = useStore.getState();
          expect(newState.stage).toBe('selectOption' satisfies Stage);
          expect(newState.carToBeAdded.commands).toEqual([
            'F',
            'R',
            'F',
            'L',
            'F',
            'F',
            'F',
            'R',
            'L',
            'F',
          ]);
          expect(newState.cars.length).toBe(1);
          expect(newState.cars[0]).toEqual({
            name: 'car1',
            facing: 'N',
            x: 1,
            y: 2,
          } satisfies Car);
          expect(newState.consoleMessages).toEqual([
            ...state.consoleMessages,
            'FRFLFFFRLF',
            'Your current list of cars are:',
            '- car1, (1, 2) N, FRFLFFFRLF',
            'Please choose from the following options:',
            '[1] Add a car to field',
            '[2] Run simulation',
          ]);
        });

        describe('when input is invalid', () => {
          ['sdfsdfsdf', 'FFRAFF', 'F F R F F F'].forEach((input) => {
            it(`when input is ${input}`, () => {
              // Arrange
              useStore.setState({
                stage: 'addCars-command',
                fieldWidth: 10,
                fieldHeight: 10,
                carToBeAdded: {
                  name: 'car1',
                  initialPosition: {
                    x: 1,
                    y: 2,
                    facing: 'N',
                  },
                },
              });
              const state = useStore.getState();

              // Act
              state.dispatchCommand(input);

              // Assert
              const newState = useStore.getState();
              expect(newState.stage).toBe('addCars-command' satisfies Stage);
              expect(newState.carToBeAdded.commands).toBeFalsy();
              expect(newState.cars.length).toBe(0);
              expect(newState.consoleMessages).toEqual([
                ...state.consoleMessages,
                input,
                'Invalid format. Valid format is a string of commands (F, L, R).',
                'Please enter the commands for car car1:',
              ]);
            });
          });

          it(`when car is out of bounds`, () => {
            // Arrange
            useStore.setState({
              stage: 'addCars-command',
              fieldWidth: 1,
              fieldHeight: 1,
              carToBeAdded: {
                name: 'car1',
                initialPosition: {
                  x: 1,
                  y: 2,
                  facing: 'N',
                },
              },
            });
            const state = useStore.getState();

            // Act
            state.dispatchCommand('F');

            // Assert
            const newState = useStore.getState();
            expect(newState.stage).toBe('selectOption' satisfies Stage);
            expect(newState.cars.length).toBe(0);
            expect(newState.consoleMessages).toEqual([
              ...state.consoleMessages,
              'F',
              'Car is out of bounds',
              'Please choose from the following options:',
              '[1] Add a car to field',
              '[2] Run simulation',
            ]);
          });
        });
      });
    });
  });
});
