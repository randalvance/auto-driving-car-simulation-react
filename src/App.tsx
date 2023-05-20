import './App.css';
import React, { useEffect } from 'react';
import { Simulation } from '@/components/Simulation';
import { useStore } from '@/store';

const App: React.FC = () => {
  const { step, setFieldBounds, addCar } = useStore((s) => s);
  useEffect(() => {
    setFieldBounds(20, 20);
    addCar({ name: 'car1', x: 0, y: 0, facing: 'N' }, [
      'F',
      'F',
      'F',
      'F',
      'R',
      'F',
      'L',
      'L',
      'F',
      'F',
    ]);
    addCar({ name: 'car2', x: 10, y: 10, facing: 'S' }, [
      'F',
      'F',
      'R',
      'F',
      'F',
    ]);
    addCar({ name: 'car3', x: 0, y: 10, facing: 'E' }, [
      'F',
      'F',
      'F',
      'F',
      'R',
      'F',
      'F',
      'F',
    ]);
    const store = useStore.getState();
    const interval = setInterval(() => {
      store.nextStep();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <>
      <h1>Step {step}</h1>
      <Simulation />
    </>
  );
};

export default App;
