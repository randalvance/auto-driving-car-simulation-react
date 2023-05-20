import './App.css';
import React from 'react';
import { Field } from './components/Field';

const App: React.FC = () => {
  return (
    <>
      <div>
        <h1>Auto-Driving Car Simulation</h1>
        <Field width={10} height={10} cars={[{ name: 'Car1', x: 2, y: 5 }]} />
      </div>
    </>
  );
};

export default App;
