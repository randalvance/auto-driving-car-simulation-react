import { type Car } from '@/types';
import { reportCarList } from './reportCarList';

it('should report car list', () => {
  const cars: Car[] = [
    {
      name: 'car1',
      x: 1,
      y: 2,
      direction: 'N',
      commands: 'FLFFRUF',
      commandCursor: 0,
      moveHistory: '',
      historyCursor: 0,
    },
    {
      name: 'car2',
      x: 4,
      y: 3,
      direction: 'N',
      commands: 'FFRRFFUFF',
      commandCursor: 0,
      moveHistory: '',
      historyCursor: 0,
    },
  ];

  const report = reportCarList(cars);

  expect(report).toBe(`Your current list of cars are:
- car1, (1, 2) N, FLFFRUF
- car2, (4, 3) N, FFRRFFUFF`);
});
