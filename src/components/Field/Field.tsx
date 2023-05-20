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
      style={{ width: width * 100, height: height * 100 }}
    >
      {cars.map((car, index) => (
        <div
          key={index}
          className={styles.car}
          role="car"
          style={{ bottom: car.y * 100, left: car.x * 100 }}
        />
      ))}
    </div>
  );
};
