import { describe, expect, it } from '@jest/globals'

describe('adding operation', () => {
  it('should return correct result', () => {
    const addingResult = 6 + 4

    expect(addingResult).toStrictEqual(10)
  })
})
