import { type Car, type Field } from '@/types';

export type CarAction = (car: Car, field: Field) => Car;
