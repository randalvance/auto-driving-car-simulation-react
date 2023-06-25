import React from 'react';

import styles from './styles.module.css';
import { getRotationBasedOnDirection } from './helpers';
import { type Car, type CarLegacy } from '@/types';
import { Grid } from './Grid';

interface Props {
  width: number;
  height: number;
  cars: CarRenderInfo[];
  collidedCars: Array<CarLegacy['name']>;
}

export interface CarRenderInfo {
  name: Car['name'];
  x: Car['x'];
  y: Car['y'];
  direction: Car['direction'];
  collided: boolean;
}

export const Field: React.FC<Props> = ({ width, height, cars }) => {
  return (
    <div
      className={styles.field}
      role="field"
      style={{ width: width * 50, height: height * 50 }}
    >
      <Grid height={height} width={width} />
      {cars.map((car) => (
        <React.Fragment key={`${car.name}-container`}>
          <div
            className={`${styles.car} ${car.collided ? styles.exploded : ''}`}
            role="car"
            style={{
              bottom: car.y * 50,
              left: car.x * 50,
              transform: `rotate(${getRotationBasedOnDirection(
                car.direction,
              )}deg)`,
            }}
          />
          <label
            role="label"
            className={styles.carLabel}
            style={{
              bottom: car.y * 50 + 50,
              left: car.x * 50,
            }}
          >
            {`${car.name} (${car.x}, ${car.y})`}
          </label>
        </React.Fragment>
      ))}
    </div>
  );
};
