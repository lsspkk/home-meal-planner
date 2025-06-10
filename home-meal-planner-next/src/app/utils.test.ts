import { describe, it, expect } from 'vitest';
import { getWeekNumber } from './utils';

describe('getWeekNumber', () => {
  it('returns the correct ISO week number for a known date', () => {
    // 1st January 2024 is a Monday, ISO week 1
    expect(getWeekNumber(new Date('2024-01-01'))).toBe(1);
    // 31st December 2023 is a Sunday, ISO week 52
    expect(getWeekNumber(new Date('2023-12-31'))).toBe(52);
  });
}); 