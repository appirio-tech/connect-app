/* eslint quotes: 0 */
import chai from 'chai'
import { evaluate } from './dependentQuestionsHelper'

chai.should()

const testData = {
  text: 'string',
  textEmpty: '',
  a: 1,
  b: 2,
  c: 1,
  someArray: [1, 2, 3],
  someArrayWithText: ['a', 'b', 'c'],
  f: false,
  t: true,
}

describe('Evaluate', () => {

  describe('operator', () => {
    it('hasLength (true)', () => {
      const expression = 'someArray hasLength 3'
      const result = evaluate(expression, testData)

      result.should.equal(true)
    })

    it('hasLength (false)', () => {
      const expression = 'someArray hasLength 4'
      const result = evaluate(expression, testData)

      result.should.equal(false)
    })

    it('!false => true', () => {
      const expression = '!f'
      const result = evaluate(expression, testData)

      result.should.equal(true)
    })

    it('!true => false', () => {
      const expression = '!t'
      const result = evaluate(expression, testData)

      result.should.equal(false)
    })

    it('! with conditions', () => {
      const expression = '!t || !f'
      const result = evaluate(expression, testData)

      result.should.equal(true)
    })

    it('!textEmpty => true', () => {
      const expression = '!textEmpty'
      const result = evaluate(expression, testData)

      result.should.equal(true)
    })

    it('!text => false', () => {
      const expression = '!text'
      const result = evaluate(expression, testData)

      result.should.equal(false)
    })

    it('== (true)', () => {
      const expression = 'f == f'
      const result = evaluate(expression, testData)

      result.should.equal(true)
    })

    it('== (false)', () => {
      const expression = 'f == t'
      const result = evaluate(expression, testData)

      result.should.equal(false)
    })

    it('!= (true)', () => {
      const expression = 'f != t'
      const result = evaluate(expression, testData)

      result.should.equal(true)
    })

    it('!= (false)', () => {
      const expression = 'f != f'
      const result = evaluate(expression, testData)

      result.should.equal(false)
    })
  })

  describe('logical operators', () => {
    
    it('test plain conditions', () => {
      const expression = '(someArrayWithText contains \'a\' || someArrayWithText contains \'d\')'
      const result = evaluate(expression, testData)

      result.should.equal(true)
    })

    it('contains \'a\' && hasLength (true)', () => {
      const expression = '(someArrayWithText contains \'a\') && (someArrayWithText hasLength 3)'
      const result = evaluate(expression, testData)

      result.should.equal(true)
    })

    it('contains \'a\' || contains \'b\'', () => {
      const expression = 'someArrayWithText contains \'d\' && someArrayWithText contains \'b\''
      const result = evaluate(expression, testData)

      result.should.equal(false)
    })

    it('contains \'a\' && hasLength (true) && contains \'b\'', () => {
      const expression = 'someArrayWithText contains \'a\' && someArrayWithText hasLength 3 && someArrayWithText contains \'b\''
      const result = evaluate(expression, testData)

      result.should.equal(true)
    })

    it('contains \'a\' && hasLength (false)', () => {
      const expression = '(someArrayWithText contains \'a\') && (someArrayWithText hasLength 2)'
      const result = evaluate(expression, testData)

      result.should.equal(false)
    })

    it('contains \'a\' && hasLength (false) && contains \'b\'', () => {
      const expression = '((someArrayWithText contains \'a\') && (someArrayWithText hasLength 1) && (someArrayWithText contains \'b\'))'
      const result = evaluate(expression, testData)

      result.should.equal(false)
    })
  })

  describe('expression format', () => {
    it('no spaces near parenthesis', () => {
      const expression = 'someArray contains (a + b) * 2'
      const result = evaluate(expression, testData)

      result.should.equal(false)
    })

    it('no spaces near parenthesis with conditions', () => {
      const expression = `(someArrayWithText contains 'a') || (someArrayWithText contains 'b') || (someArrayWithText contains 'c')`
      const result = evaluate(expression, testData)

      result.should.equal(true)
    })

    it('multiple spaces', () => {
      const expression = 'someArray  contains  (  b  -  a  )  *  2'
      const result = evaluate(expression, testData)

      result.should.equal(true)
    })
  })
})
