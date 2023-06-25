import { type CarAction } from '../types';

// HOC to check if the car is within the field after an action
export const _withinFieldCheck = (carAction: CarAction): CarAction => {
  return (car, field, trackHistory) => {
    const carAfterMove = carAction(car, field, trackHistory);

    if (
      carAfterMove.x < 0 ||
      carAfterMove.x >= field.width ||
      carAfterMove.y < 0 ||
      carAfterMove.y >= field.height
    ) {
      return {
        ...car,
        commandCursor: car.commandCursor + 1,
      };
    }

    return carAfterMove;
  };
};
