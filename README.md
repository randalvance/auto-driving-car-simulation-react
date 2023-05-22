# Auto Driving Car Simulation (React)

## Try it out
1. Visit `https://autodrive.randal.tech` to try out the app

## Run Locally
1. `npm install`
2. `npm start`
3. Open browser at port `http://localhost:3000`

## Run Tests
1. `npm test`

## Code Walkthrough
1. The meat of the logic is in `store.ts`. All the tests are in `store.test.ts`.
   1. Accepting commands from console and tracking stage
   2. Adding new cars
   3. Moving cars
   4. Detecting collisions
2. There are 3 main React components.
   1. `Console.tsx` - Emulate a console that can input commands
   2. `Field.tsx` - Renders the fields and the cars
   3. `Simulation.tsx` - Composes the two components above and orchestrates the simulation.
