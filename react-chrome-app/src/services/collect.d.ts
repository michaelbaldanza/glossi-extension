import { Result } from './types';

declare module './dictionaries' {
  export function collect(term: string): Promise<Result>;
}