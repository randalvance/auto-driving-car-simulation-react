import React, { useEffect, useMemo } from 'react';
import { type CarRenderInfo, Field } from '@/components/Field';
import { useStore } from '@/store';
import styles from './style.module.css';
import { Console } from '@/components/Console';
import { type Car } from '@/types';
import { isSimulationComplete } from '@/services/simulator';

export const Simulation: React.FC = () => {
  const [stage, simulateNextStep, isDone] = useStore((s) => [
    s.stage,
    s.simulateNextStep,
    s.isDone,
  ]);
  const simulation = useStore((s) => s.simulation);
  const isComplete = useMemo(
    () => isSimulationComplete(simulation),
    [simulation],
  );
  useEffect(() => {
    if (isComplete) {
      return;
    }
    const interval = setInterval(() => {
      simulateNextStep();
    }, 1000);

    return () => {
      console.log('Done');
      clearInterval(interval);
    };
  }, [isComplete]);
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
    collided: (car.collisionInfo?.length ?? 0) > 0,
  }));
};
