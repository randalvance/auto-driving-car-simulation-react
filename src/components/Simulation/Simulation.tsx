import React, { useEffect, useMemo } from 'react';
import { type CarRenderInfo, Field } from '@/components/Field';
import { useStore } from '@/store';
import styles from './style.module.css';
import { Console } from '@/components/Console';
import { type Car } from '@/types';

export const Simulation: React.FC = () => {
  const [stage, simulateNextStep, isDone] = useStore((s) => [
    s.stage,
    s.simulateNextStep,
    s.isDone,
  ]);
  useEffect(() => {
    simulateNextStep();
  }, [stage]);
  const [cars, field, collisions, consoleMessages] = useStore((state) => [
    state.simulation.cars,
    state.simulation.field,
    state.collisions,
    state.consoleMessages,
  ]);
  const carsToRender = useMemo(() => {
    return getCarsToRender(cars);
  }, [cars]);
  return (
    <div className={styles.container}>
      <Console
        messages={consoleMessages}
        disabled={stage === 'runSimulation' || isDone}
      />
      <div className={styles.fieldContainer}>
        <Field
          height={field.height}
          width={field.width}
          cars={carsToRender}
          collidedCars={collisions.map((c) => c.carName)}
        />
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
  }));
};
