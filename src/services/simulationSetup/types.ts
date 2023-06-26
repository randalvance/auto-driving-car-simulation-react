import { type State } from '@/types';

export type CommandProcessor = (state: State, commandString: string) => State;
