import styles from './styles.module.css';
import React from 'react';

interface Props {
  messages: string[];
}

export const Console: React.FC<Props> = ({ messages }) => {
  return (
    <div className={styles.container}>
      {messages.map((message, index) => (
        <div role="message" key={index} className={styles.message}>
          {message}
        </div>
      ))}
    </div>
  );
};
