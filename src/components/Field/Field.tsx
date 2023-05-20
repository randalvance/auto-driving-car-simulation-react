import React from 'react';

import styles from './styles.module.css';

interface Car {
  x: number;
  y: number;
}

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
      {cars.map((car, index) => (
        <div
          key={index}
          className={styles.car}
          role="car"
          style={{ bottom: car.y * 50, left: car.x * 50 }}
        />
      ))}
    </div>
  );
};
