import { type CollisionInfo, type Car } from '@/types';
import { produce } from 'immer';

/** Get information of which cars have collided. Returns the car with collision info.
 * @param carName The name of the car to check for collisions
 * @param cars All the cars in the simulation (may include the car to check for collisions)
 * @param step The current step of the simulation
 * @returns The names of all the cars the car has collided with
 */
export const detectCollisions = (
  carName: Car['name'],
  cars: Car[],
  step: number,
): Car => {
  const carIndex = cars.findIndex((car) => car.name === carName);

  if (carIndex === -1) throw new Error(`Car ${carName} not found`);

  const car = cars[carIndex];
  const collisionInfo: CollisionInfo[] = [];

  for (const otherCar of cars) {
    // Don't check for collisions with itself
    if (otherCar.name === carName) continue;

    if (car.x === otherCar.x && car.y === otherCar.y) {
      collisionInfo.push({
        carName: otherCar.name,
        step: step,
      });
    }
  }

  return produce(car, (draft) => {
    draft.collisionInfo = collisionInfo;
  });
};
