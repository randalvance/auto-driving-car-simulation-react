import React from 'react';
import { Field } from '@/components/Field';
import { useStore } from '@/store';

export const Simulation: React.FC = () => {
  const [cars, fieldHeight, fieldWidth] = useStore((state) => [
    state.cars,
    state.fieldHeight,
    state.fieldWidth,
  ]);
  return <Field height={fieldHeight} width={fieldWidth} cars={cars} />;
};
