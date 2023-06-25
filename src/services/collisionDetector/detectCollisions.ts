import { type Car } from '@/types';

/** Get information of which cars have collided. Returns all the cars a particular car has collided with.
 * @param carName The name of the car to check for collisions
 * @param cars All the cars in the simulation (may include the car to check for collisions)
 * @returns The names of all the cars the car has collided with
 */
export const detectCollisions = (
  carName: Car['name'],
  cars: Car[],
): Array<Car['name']> => {
  return [];
};
