import styles from './styles.module.css';
import React, { useEffect, useRef } from 'react';

interface Props {
  messages: string[];
}

export const Console: React.FC<Props> = ({ messages }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  return (
    <div className={styles.container}>
      {messages.map((message, index) => (
        <div role="message" key={index} className={styles.message}>
          {message}
        </div>
      ))}
      <div className={styles.message}>
        <input
          role="input"
          ref={inputRef}
          type="text"
          className={styles.input}
        />
      </div>
    </div>
  );
};
