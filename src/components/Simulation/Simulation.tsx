import React, { useEffect } from 'react';
import { Field } from '@/components/Field';
import { useStore } from '@/store';
import styles from './style.module.css';
import { Console } from '@/components/Console';

export const Simulation: React.FC = () => {
  const [stage, nextStep, isDone] = useStore((s) => [
    s.stage,
    s.nextStep,
    s.isDone,
  ]);
  useEffect(() => {
    if (stage !== 'runSimulation') return;
    const interval = setInterval(() => {
      nextStep();
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [stage]);
  const [cars, fieldHeight, fieldWidth, collisions, consoleMessages] = useStore(
    (state) => [
      state.cars,
      state.fieldHeight,
      state.fieldWidth,
      state.collisions,
      state.consoleMessages,
    ],
  );
  return (
    <div className={styles.container}>
      <Console
        messages={consoleMessages}
        disabled={stage === 'runSimulation' || isDone}
      />
      <div className={styles.fieldContainer}>
        <Field
          height={fieldHeight}
          width={fieldWidth}
          cars={cars}
          collidedCars={collisions.map((c) => c.carName)}
        />
      </div>
    </div>
  );
};
