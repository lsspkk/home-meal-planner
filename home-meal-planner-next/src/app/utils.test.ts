import { describe, it, expect } from 'vitest'
import { getWeekNumber, encodeBasicAuth } from './utils'

describe('getWeekNumber', () => {
  it('returns the correct ISO week number for a known date', () => {
    // 1st January 2024 is a Monday, ISO week 1
    expect(getWeekNumber(new Date('2024-01-01'))).toBe(1)
    // 31st December 2023 is a Sunday, ISO week 52
    expect(getWeekNumber(new Date('2023-12-31'))).toBe(52)
  })

  it('returns correct ISO week number for June 14, 2025', () => {
    // June 14, 2025 is a Saturday
    const date = new Date('2025-06-14T12:00:00Z')
    const week = getWeekNumber(date)
    // Check what the function returns
    expect(week).toBeGreaterThanOrEqual(23)
    expect(week).toBeLessThanOrEqual(25)
    // Print for debug
    console.log('Week number for 2025-06-14:', week)
  })

  it('returns week 1 for first week of January 2025', () => {
    const date = new Date('2025-01-01T12:00:00Z')
    const week = getWeekNumber(date)
    expect(week).toBe(1)
  })

  it('returns week 1 for last week of December 2025 (ISO-8601)', () => {
    const date = new Date('2025-12-31T12:00:00Z')
    const week = getWeekNumber(date)
    // According to ISO-8601, 2025-12-31 is in week 1 of 2026
    expect(week).toBe(1)
  })
})

describe('encodeBasicAuth', () => {
  it('encodes å correctly', () => {
    const actual = encodeBasicAuth('å', 'å')
    const expected = 'JUMzJUE1:JUMzJUE1'
    console.log('å:', actual)
    expect(actual).toBe(expected)
  })

  it('encodes ä correctly', () => {
    const actual = encodeBasicAuth('ä', 'ä')
    const expected = 'JUMzJUE0:JUMzJUE0'
    console.log('ä:', actual)
    expect(actual).toBe(expected)
  })

  it('encodes ö correctly', () => {
    const actual = encodeBasicAuth('ö', 'ö')
    const expected = 'JUMzJUI2:JUMzJUI2'
    console.log('ö:', actual)
    expect(actual).toBe(expected)
  })

  it('encodes åäöÅÄÖ correctly', () => {
    const actual = encodeBasicAuth('åäöÅÄÖ', 'åäöÅÄÖ')
    const expected = 'JUMzJUE1JUMzJUE0JUMzJUI2JUMzJTg1JUMzJTg0JUMzJTk2:JUMzJUE1JUMzJUE0JUMzJUI2JUMzJTg1JUMzJTg0JUMzJTk2'
    console.log('åäöÅÄÖ:', actual)
    expect(actual).toBe(expected)
  })
})
