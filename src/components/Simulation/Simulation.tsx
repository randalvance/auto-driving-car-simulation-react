import React, { useEffect, useMemo } from 'react';
import { type CarRenderInfo, Field } from '@/components/Field';
import { useStore } from '@/store';
import styles from './style.module.css';
import { Console } from '@/components/Console';
import { type Car } from '@/types';
import { isSimulationComplete } from '@/services/simulator';

export const Simulation: React.FC = () => {
  const [
    simulation,
    cars,
    field,
    consoleMessages,
    inputStep,
    simulateNextStep,
    reset,
  ] = useStore((s) => [
    s.simulation,
    s.simulation.cars,
    s.simulation.field,
    s.setup.consoleMessages,
    s.setup.inputStep,
    s.simulateNextStep,
    s.reset,
  ]);

  const isComplete = useMemo(
    () => isSimulationComplete(simulation),
    [simulation],
  );

  useEffect(() => {
    if (isComplete || inputStep !== 'runningSimulation') {
      return;
    }
    const interval = setInterval(() => {
      simulateNextStep();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [isComplete, inputStep]);

  // Upon entering, initialize setup
  useEffect(() => {
    reset();
  }, []);

  const carsToRender = useMemo(() => {
    return getCarsToRender(cars);
  }, [cars]);
  return (
    <div className={styles.container}>
      <Console
        messages={consoleMessages}
        disabled={inputStep === 'runningSimulation' || inputStep === 'exit'}
      />
      <div className={styles.fieldContainer}>
        <Field height={field.height} width={field.width} cars={carsToRender} />
      </div>
    </div>
  );
};

const getCarsToRender = (cars: Car[]): CarRenderInfo[] => {
  return cars.map((car) => ({
    name: car.name,
    x: car.x,
    y: car.y,
    direction: car.direction,
    collided: (car.collisionInfo?.length ?? 0) > 0,
  }));
};
