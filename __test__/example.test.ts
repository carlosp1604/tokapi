import { describe, it } from '@std/testing/bdd'
import { expect } from '@std/expect'

describe('adding operation', () => {
  it('should return correct result', () => {
    const addingResult = 6 + 4

    expect(addingResult).toStrictEqual(10)
  })
})
