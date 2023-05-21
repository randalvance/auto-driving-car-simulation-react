import React from 'react';
import { Field } from '@/components/Field';
import { useStore } from '@/store';
import styles from './style.module.css';
import { Console } from '@/components/Console';

export const Simulation: React.FC = () => {
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
      <Console messages={consoleMessages} />
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
