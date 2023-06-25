import { type CollisionInfo, type Car } from '@/types';
import { produce } from 'immer';

/** Get information of which cars have collided. Returns the cars with collision info.
 * @param carName The name of the car to check for collisions
 * @param cars All the cars in the simulation (may include the car to check for collisions)
 * @param step The current step of the simulation
 * @returns The list of cars with updated collision info
 */
export const detectCollisions = (
  carName: Car['name'],
  cars: Car[],
  step: number,
): Car[] => {
  const carIndex = cars.findIndex((car) => car.name === carName);

  if (carIndex === -1) throw new Error(`Car ${carName} not found`);

  const car = cars[carIndex];
  const collisionInfo: CollisionInfo[] = [];

  const carsWithCollisionInfo: Car[] = [];

  for (const otherCar of cars) {
    const hasCollided = car.x === otherCar.x && car.y === otherCar.y;

    // Check if no collisions
    if (otherCar.name === carName || !hasCollided) {
      carsWithCollisionInfo.push(otherCar);
      continue;
    }

    // At this point, we have a collision

    // Add to the car's collision info
    collisionInfo.push({
      carName: otherCar.name,
      step: step,
    });

    // Update other car to register collision
    carsWithCollisionInfo.push(
      produce(otherCar, (draft) => {
        draft.collisionInfo = draft.collisionInfo ?? [];
        draft.collisionInfo.push({
          carName: car.name,
          step: step,
        });
      }),
    );
  }

  return produce(carsWithCollisionInfo, (draft) => {
    draft[carIndex].collisionInfo = collisionInfo;
  });
};
