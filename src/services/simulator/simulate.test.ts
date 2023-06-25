import { simulate } from './simulate';

it('should simulate', () => {
  const result = simulate({ field: { width: 0, height: 0 }, cars: [] });
  expect(result).toBeTruthy();
});
