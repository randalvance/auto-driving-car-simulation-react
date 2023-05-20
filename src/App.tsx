import './App.css';
import React from 'react';
import { Field } from './components/Field';

const App: React.FC = () => {
  return (
    <>
      <div>
        <h1>Auto-Driving Car Simulation</h1>
        <Field width={10} height={10} />
      </div>
    </>
  );
};

export default App;
