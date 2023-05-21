import React, { useMemo } from 'react';
import styles from './styles.module.css';

interface Props {
  width: number;
  height: number;
}

export const Grid: React.FC<Props> = ({ width, height }) => {
  const grid = useMemo(
    () => Array.from({ length: width }, (_) => Array.from({ length: height })),
    [width, height],
  );
  const cells = grid.flatMap((row, x) =>
    row.map((_, y) => (
      <div
        key={`cell-${x}-${y}`}
        className={styles.gridCell}
        style={{ bottom: 50 * y, left: 50 * x }}
      >
        {x + 0},{y + 0}
      </div>
    )),
  );
  return (
    <div
      style={{ height: 50 * height, width: 50 * width }}
      className={styles.grid}
    >
      {cells}
    </div>
  );
};
