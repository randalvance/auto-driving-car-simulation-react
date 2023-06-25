import { type Car } from '@/types';

export const reportCarList = (cars: Car[]): string => {
  return (
    'Your current list of cars are:\n' +
    cars
      .map(
        (car) =>
          `- ${car.name}, (${car.x}, ${car.y}) ${car.direction}, ${car.commands}`,
      )
      .join('\n')
  );
};
