import styles from './styles.module.css';
import React from 'react';

interface Props {
  messages: string[];
}

export const Console: React.FC<Props> = () => {
  return (
    <div className={styles.container}>
      <h1>Console</h1>
    </div>
  );
};
