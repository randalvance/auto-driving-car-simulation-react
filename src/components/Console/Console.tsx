import styles from './styles.module.css';
import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '@/store';

interface Props {
  messages: string[];
}

export const Console: React.FC<Props> = ({ messages }) => {
  const [dispatchCommand] = useStore((s) => [s.dispatchCommand]);
  const [command, setCommand] = useState<string>('');
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
          value={command}
          onChange={(event) => {
            setCommand(event.currentTarget.value);
          }}
          onKeyDown={(event) => {
            if (event.key !== 'Enter') return;
            dispatchCommand(event.currentTarget.value);
            setCommand('');
          }}
        />
      </div>
    </div>
  );
};
