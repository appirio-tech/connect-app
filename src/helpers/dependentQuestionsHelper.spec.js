import chai from 'chai'
import { evaluate } from './dependentQuestionsHelper'

chai.should()

const testData = {
  a: 1,
  b: 2,
  c: 1,
  arr: [1, 2, 3],
  f: false,
  t: true,
}

describe('Evaluate', () => {

  describe('operator', () => {
    it('!= (true)', () => {
      const expression = 'a != b'
      const result = evaluate(expression, testData)

      result.should.equal(true)
    })

    it('!= (false)', () => {
      const expression = 'a != c'
      const result = evaluate(expression, testData)

      result.should.equal(false)
    })

    it('hasLength (true)', () => {
      const expression = 'arr hasLength 3'
      const result = evaluate(expression, testData)

      result.should.equal(true)
    })

    it('hasLength (false)', () => {
      const expression = 'arr hasLength 4'
      const result = evaluate(expression, testData)

      result.should.equal(false)
    })

    it('! (true)', () => {
      const expression = '!f'
      const result = evaluate(expression, testData)

      result.should.equal(true)
    })

    it('! (false)', () => {
      const expression = '!t'
      const result = evaluate(expression, testData)

      result.should.equal(false)
    })
  })

  describe('expression format', () => {
    it('optional spaces', () => {
      const expression = 'arr contains (a+b)*2'
      const result = evaluate(expression, testData)

      result.should.equal(false)
    })

    it('multiple spaces', () => {
      const expression = 'arr  contains  (  b  -  a  )  *  2'
      const result = evaluate(expression, testData)

      result.should.equal(true)
    })
  })
})
