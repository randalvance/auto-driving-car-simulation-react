import './App.css';
import React from 'react';
import { Field } from './components/Field';

const App: React.FC = () => {
  return (
    <>
      <div>
        <h1>Auto-Driving Car Simulation</h1>
        <Field
          width={10}
          height={10}
          cars={[
            { name: 'Car1', x: 2, y: 5, facing: 'N' },
            { name: 'Car2', x: 4, y: 3, facing: 'W' },
          ]}
        />
      </div>
    </>
  );
};

export default App;
