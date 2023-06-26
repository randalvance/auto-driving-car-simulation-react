import { type Car } from '@/types';

export const reportCarCollisions = (cars: Car[]): string => {
  return `After simulation, the result is:
${cars
  .map((car) => printCarPosition(car) + printCollisionInfo(car))
  .join('\n')}`;
};

const printCollisionInfo = (car: Car): string => {
  if (car.collisionInfo === undefined) {
    return '';
  }
  return car.collisionInfo
    .map((collision) => {
      return `- ${car.name}, collides with ${collision.carName} at (${car.x}, ${car.y}) at step ${collision.step}`;
    })
    .join('\n');
};

const printCarPosition = (car: Car): string => {
  if (car.collisionInfo != null) return '';
  return `- ${car.name}, (${car.x}, ${car.y}) ${car.direction}`;
};
