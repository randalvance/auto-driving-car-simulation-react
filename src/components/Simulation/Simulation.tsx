import React from 'react';
import { Field } from '@/components/Field';
import { useStore } from '@/store';

export const Simulation: React.FC = () => {
  const [cars, fieldHeight, fieldWidth, collisions] = useStore((state) => [
    state.cars,
    state.fieldHeight,
    state.fieldWidth,
    state.collisions,
  ]);
  return (
    <Field
      height={fieldHeight}
      width={fieldWidth}
      cars={cars}
      collidedCars={collisions.map((c) => c.carName)}
    />
  );
};
