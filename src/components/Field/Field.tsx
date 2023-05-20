import React from 'react';

import styles from './styles.module.css';
import { getRotationBasedOnDirection } from './helpers';
import { type Car } from '@/types';

interface Props {
  width: number;
  height: number;
  cars: Car[];
}

export const Field: React.FC<Props> = ({ width, height, cars }) => {
  return (
    <div
      className={styles.field}
      role="field"
      style={{ width: width * 50, height: height * 50 }}
    >
      {cars.map((car) => (
        <div
          key={car.name}
          className={styles.car}
          role="car"
          style={{
            bottom: car.y * 50,
            left: car.x * 50,
            transform: `rotate(${getRotationBasedOnDirection(car.facing)}deg)`,
          }}
        />
      ))}
    </div>
  );
};
