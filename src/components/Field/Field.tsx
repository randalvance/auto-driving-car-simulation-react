import React from 'react';

import styles from './styles.module.css';

interface Props {
  width: number;
  height: number;
}

export const Field: React.FC<Props> = ({ width, height }) => {
  return (
    <div
      className={styles.field}
      role="field"
      style={{ width: width * 100, height: height * 100 }}
    ></div>
  );
};
