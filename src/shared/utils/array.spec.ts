import { newValues, chunks } from './array'

describe('Utils array', () => {
  describe('newValues', () => {
    test('should return empty array if no additions', () => {
      expect(newValues([], [])).toEqual([])
      expect(newValues(['abc'], ['abc'])).toEqual([])
      expect(newValues(['abc', 'cde'], ['abc', 'cde'])).toEqual([])
    })
    test('should return array of additions', () => {
      expect(newValues([], ['abc'])).toEqual(['abc'])
      expect(newValues(['abc'], ['abc', 'cde'])).toEqual(['cde'])
      expect(newValues(['abc'], ['abc', 'cde', 'efg'])).toEqual(['cde', 'efg'])
    })
  })
  describe('chunk', () => {
    test('should return same array if number of elements is smaller or equal than groupSize', () => {
      expect(chunks([1, 2, 3, 4], 100)).toEqual([[1, 2, 3, 4]])
      expect(chunks([1, 2, 3, 4], 4)).toEqual([[1, 2, 3, 4]])
    })
    test('should split into arrays of max size groupSize', () => {
      expect(chunks([1, 2, 3, 4], 3)).toEqual([[1, 2, 3], [4]])
      expect(chunks([1, 2, 3, 4, 5], 3)).toEqual([[1, 2, 3], [4, 5]])
      expect(chunks([1, 2, 3, 4, 5, 6], 3)).toEqual([[1, 2, 3], [4, 5, 6]])
      expect(chunks([1, 2, 3, 4, 5, 6, 7], 3)).toEqual([[1, 2, 3], [4, 5, 6], [7]])
    })
  })
})
