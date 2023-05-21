import './App.css';
import React, { useEffect } from 'react';
import { Simulation } from '@/components/Simulation';
import { useStore } from '@/store';

const App: React.FC = () => {
  const { addCar } = useStore((s) => s);
  useEffect(() => {
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
      'F',
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
    addCar({ name: 'car4', x: 1, y: 9, facing: 'E' }, [
      'F',
      'F',
      'F',
      'R',
      'R',
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
      <Simulation />
    </>
  );
};

export default App;
