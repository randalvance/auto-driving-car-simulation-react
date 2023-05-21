import styles from './styles.module.css';
import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '@/store';

interface Props {
  messages: string[];
  disabled?: boolean;
}

export const Console: React.FC<Props> = ({ messages, disabled }) => {
  const [dispatchCommand] = useStore((s) => [s.dispatchCommand]);
  const [command, setCommand] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
    // In tests, scrollTo is not supported
    if (typeof containerRef.current?.scrollTo !== 'function') return;
    containerRef.current?.scrollTo(0, containerRef.current.scrollHeight);
  }, [messages]);
  return (
    <div
      ref={containerRef}
      className={styles.container}
      onClick={() => inputRef.current?.focus()}
    >
      {messages.map((message, index) => (
        <div role="message" key={index} className={styles.message}>
          {message}
        </div>
      ))}
      {disabled !== true && (
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
      )}
    </div>
  );
};
