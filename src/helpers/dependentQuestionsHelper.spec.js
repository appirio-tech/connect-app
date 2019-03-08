/* eslint quotes: 0 */
import chai from 'chai'
import { evaluate, populatePreparedConditions } from './dependentQuestionsHelper'

chai.should()

const testData = {
  text: 'string',
  textEmpty: '',
  a: 1,
  stringa: '1',
  b: 2,
  c: 3,
  d: -1,
  zero: 0,
  someArray: [1, 2, 3],
  someArrayWithText: ['a', 'b', 'c'],
  f: false,
  t: true,
  nestedObject: {
    textProperty: 'test',
    PREPARED_CONDITION_1: 'fake prepared condition property',
    propertyWithObject: {
      PREPARED_CONDITION_2: 'fake prepared condition property'
    },
  }
}

const preparedConditions = {
  PREPARED_CONDITION_1: '(someArray hasLength 3)',
  PREPARED_CONDITION_2: `((someArrayWithText contains 'a') || (someArrayWithText contains 'b'))`
}

describe('Evaluate: ', () => {
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

    xit('multiple spaces', () => {
      const expression = 'someArray  contains  (  b  -  a  )  *  2'
      const result = evaluate(expression, testData)

      result.should.equal(true)
    })
  })

  describe ('+ operator', () => {
    it ('should do simple addition', () => {
      const expression = 'a + b'
      const result = evaluate(expression, testData)

      result.should.equal(testData.a + testData.b)
    })

    xit ('should be read as separate from other tokens even if there are no spaces in between', () => {
      const expression = 'a+b'
      const result = evaluate(expression, testData)

      result.should.equal(testData.a + testData.b)
    })

    xit ('should identify signs in numbers', () => {
      const expression = '- a + ( + b)'
      const result = evaluate(expression, testData)

      result.should.equal(-testData.a + testData.b)
    })

    it ('should be commutative', () => {
      const res1 = evaluate('a + b', testData)
      const res2 = evaluate('b + a', testData)

      res1.should.equal(res2)
    })

    it ('should be associative', () => {
      const res1 = evaluate('a + (b + c)', testData)
      const res2 = evaluate('(a + b) + c', testData)

      res1.should.equal(res2)
    })

    it ('should be distributive', () => {
      const res1 = evaluate('a * (b + c)', testData)
      const res2 = evaluate('(a * b) + (a * c)', testData)

      res1.should.equal(res2)
    })

    it ('should have additive identity', () => {
      const result = evaluate('a + 0', testData)

      result.should.equal(testData.a)
    })

    xit ('should return same if an argument is null', () => {
      const result = evaluate('a + null', testData)

      result.should.equal(testData.a)
    })

    it ('should return NaN if an argument is undefined', () => {
      const result = evaluate('a + undefined', testData)

      result.should.be.NaN
    })

    it ('should return NaN if an argument is NaN', () => {
      const result = evaluate('a + NaN', testData)

      result.should.be.NaN
    })

    it ('should add true to numbers', () => {
      const res = evaluate('t + 5', testData)
      res.should.equal(6)
    })
  })

  describe ('- operator', () => {
    it ('should do simple subtraction', () => {
      const result = evaluate('a - b', testData)
      result.should.equal(testData.a - testData.b)
    })

    xit ('should be read as separate from other tokens even if there are no spaces in between', () => {
      const expression = 'a-b'
      const result = evaluate(expression, testData)

      result.should.equal(testData.a - testData.b)
    })

    it ('should be distributive', () => {
      const res1 = evaluate('a * (b - c)', testData)
      const res2 = evaluate('(a * b) - (a * c)', testData)

      res1.should.equal(res2)
    })

    it ('should have additive identity', () => {
      const result = evaluate('a - 0', testData)

      result.should.equal(testData.a)
    })

    xit ('should return 0 if an argument is null', () => {
      const result = evaluate('a - null', testData)

      result.should.equal(testData.a)
    })

    it ('should return NaN if an argument is undefined', () => {
      const result = evaluate('a - undefined', testData)

      result.should.be.NaN
    })

    it ('should return NaN if an argument is NaN', () => {
      const result = evaluate('a - NaN', testData)

      result.should.be.NaN
    })

    it ('should subtract true from numbers', () => {
      const res = evaluate('f - 5', testData)
      res.should.equal(-5)
    })
  })

  describe ('* operator', () => {
    it ('should do simple multiplication', () => {
      const result = evaluate('a * b', testData)
      result.should.equal(testData.a * testData.b)
    })

    xit ('should be read as separate from other tokens even if there are no spaces in between', () => {
      const result = evaluate('a*b', testData)
      result.should.equal(testData.a * testData.b)
    })

    xit ('should identify signs', () => {
      const result = evaluate('a * (- b)', testData)
      result.should.equal(testData.a * (-testData.b))
    })

    it ('should be commutative', () => {
      const res1 = evaluate('a * b', testData)
      const res2 = evaluate('b * a', testData)
      res1.should.equal(res2)
    })

    it ('should be associative', () => {
      const res1 = evaluate('a * (b * c)', testData)
      const res2 = evaluate('(a * b) * c', testData)
      res1.should.equal(res2)
    })

    it ('should have multiplicative identity', () => {
      const res = evaluate('b * 1', testData)
      res.should.equal(testData.b)
    })

    xit ('should return 0 if an argument is null', () => {
      const result = evaluate('a * null', testData)

      result.should.equal(0)
    })

    it ('should return NaN if an argument is undefined', () => {
      const result = evaluate('a * undefined', testData)

      result.should.be.NaN
    })

    it ('should return NaN if an argument is NaN', () => {
      const result = evaluate('a * NaN', testData)

      result.should.be.NaN
    })

    xit ('should flip the sign of Infinity', () => {
      const res = evaluate('d * Infinity', testData)
      res.should.equal(-Infinity)
    // (-Infinity).should.equal(-1*Infinity)
    })

    it ('should return NaN when multiplying 0 and Infinity', () => {
      const res = evaluate('0 * Infinity', testData)
      isNaN(res).should.equal(true)
    })
  })

  describe ('/ operator', () => {
    it ('should do simple division', () => {
      const res = evaluate('a / b', testData)
      res.should.equal(testData.a / testData.b)
    })

    xit ('should be read as separate from other tokens even if there are no spaces in between', () => {
      const result = evaluate('a/b', testData)
      result.should.equal(testData.a * testData.b)
    })

    it ('should return Infinity when dividing be 0', () => {
      const result = evaluate('a / 0', testData)
      result.should.equal(Infinity)
    })

    xit ('should identify sign in its arguments', () => {
      const result = evaluate('- a / b', testData)
      result.should.equal(-testData.a / testData.b)
    })

    it ('should take precedence over addition and subtraction', () => {
      const result = evaluate('a + b / c - d * b', testData)
      result.should.equal(testData.a + testData.b / testData.c - testData.d * testData.b)
    })

    xit ('should return 0 when dividing by Infinity', () => {
      const result = evaluate('a / Infinity', testData)
      result.should.equal(0)
    })

    it ('should do 0 / 0 == NaN', () => {
      const result = evaluate('0 / 0', testData)
      isNaN(result).should.equal(true)
    })

    it ('should do Infinity / Infinity == NaN', () => {
      const result = evaluate('Infinity / Infinity', testData)
      isNaN(result).should.equal(true)
    })

    xit ('should return Infinity if an argument is null', () => {
      const result = evaluate('a / null', testData)

      result.should.equal(0)
    })

    it ('should return NaN if an argument is undefined', () => {
      const result = evaluate('a / undefined', testData)

      result.should.be.NaN
    })

    it ('should return NaN if an argument is NaN', () => {
      const result = evaluate('a / NaN', testData)

      result.should.be.NaN
    })
  })

  describe('== operator', () => {
    xit('should compare NaNs', () => {
      const res = evaluate('NaN == NaN', testData)
      res.should.equal(false)
    })

    xit('should compare Infinities', () => {
      const res = evaluate('Infinity == Infinity', testData)
      res.should.equal(true)
    })

    it('should compare nulls', () => {
      const res = evaluate('null == null', testData)
      res.should.equal(true)
    })

    it('should compare undefined', () => {
      const res = evaluate('undefined == undefined', testData)
      res.should.equal(true)
    })

    it ('should compare string and number', () => {
      const res = evaluate('stringa == a', testData)
      res.should.equal(false)
    })

    xit ('should compare boolean and number', () => {
      const res = evaluate('zero == f', testData)
      res.should.equal(true)
    })
  })

  describe('!= operator', () => {
    xit('should compare NaNs', () => {
      const res = evaluate('NaN != NaN', testData)
      res.should.equal(true)
    })

    xit('should compare Infinities', () => {
      const res = evaluate('Infinity != Infinity', testData)
      res.should.equal(false)
    })

    it('should compare nulls', () => {
      const res = evaluate('null != null', testData)
      res.should.equal(false)
    })

    it('should compare undefined', () => {
      const res = evaluate('undefined != undefined', testData)
      res.should.equal(false)
    })

    it ('should compare string and number', () => {
      const res = evaluate('stringa != a', testData)
      res.should.equal(true)
    })

    xit ('should compare boolean and number', () => {
      const res = evaluate('zero != f', testData)
      res.should.equal(false)
    })
  })

  describe('&& operator', () => {
    it ('true && true => true', () => {
      const res = evaluate('t && t', testData)
      res.should.equal(true)
    })

    it ('true && false => false', () => {
      const res = evaluate('t && f', testData)
      res.should.equal(false)
    })

    it ('false && true => false', () => {
      const res = evaluate('f && t', testData)
      res.should.equal(false)
    })

    it ('false && false => false', () => {
      const res = evaluate('f && f', testData)
      res.should.equal(false)
    })
  })

  describe('|| operator', () => {
    it ('true || true => true', () => {
      const res = evaluate('t || t', testData)
      res.should.equal(true)
    })

    it ('true || false => true', () => {
      const res = evaluate('t || f', testData)
      res.should.equal(true)
    })

    it ('false || true => true', () => {
      const res = evaluate('f || t', testData)
      res.should.equal(true)
    })

    it ('false || false => false', () => {
      const res = evaluate('f || f', testData)
      res.should.equal(false)
    })
  })

  describe('parser', () => {
    it('should parse literal constants like numbers', () => {
      const res = evaluate('4 + 2', testData)
      res.should.equal(4 + 2)
    })

    xit('should parse literal constants like numbers with decimal numbers', () => {
      const res = evaluate('4.2 + 2.3', testData)
      res.should.equal(4.2 + 2.3)
    })

    xit ('should parse literal constants like booleans', () => {
      const res = evaluate('true && true', testData)
      res.should.equal(true)
    })

    xit ('should treat unknown variables as undefined', () => {
      const res = evaluate('unknownVariable', testData)

      res.should.be.undefined
    })
  })

  describe('! operator', () => {
    it ('!true => false', () => {
      const res = evaluate('!t', testData)
      res.should.equal(false)
    })

    it ('!false => true', () => {
      const res = evaluate('!f', testData)
      res.should.equal(true)
    })

    xit ('!undefined => true', () => {
      const res = evaluate('!undefined', testData)
      res.should.equal(true)
    })

    xit ('!null => true', () => {
      const res = evaluate('! null', testData)
      res.should.equal(true)
    })
  })

  describe('> operator', () => {
    it ('should compare numbers', () => {
      const res = evaluate('a > b', testData)
      res.should.equal(testData.a > testData.b)
    })

    it ('should compare strings', () => {
      const res = evaluate("'absfd' > 'fsb'", testData)
      res.should.equal('absfd' > 'fsb')
    })

    it ('should compare numbers and strings', () => {
      const res = evaluate("'absfd' > 1", testData)
      res.should.equal('absfd' > 1)
    })

    it ('should compare undefined', () => {
      const res = evaluate("undefined > 1", testData)
      res.should.equal(undefined > 1)
    })

    it ('should compare null', () => {
      const res = evaluate("null > 1", testData)
      res.should.equal(null > 1)
    })

    it ('should compare NaN', () => {
      const nanval = NaN
      const res = evaluate("NaN > 1", testData)
      res.should.equal(nanval > 1)
    })
  })

  describe('< operator', () => {
    it ('should compare numbers', () => {
      const res = evaluate('a < b', testData)
      res.should.equal(testData.a < testData.b)
    })

    it ('should compare strings', () => {
      const res = evaluate("'absfd' < 'fsb'", testData)
      res.should.equal('absfd' < 'fsb')
    })

    it ('should compare numbers and strings', () => {
      const res = evaluate("'absfd' < 1", testData)
      res.should.equal('absfd' < 1)
    })

    it ('should compare undefined', () => {
      const res = evaluate("undefined < 1", testData)
      res.should.equal(undefined < 1)
    })

    xit ('should compare null', () => {
      const res = evaluate("null < 1", testData)
      res.should.equal(null < 1)
    })

    it ('should compare NaN', () => {
      const nanval = NaN
      const res = evaluate("NaN < 1", testData)
      res.should.equal(nanval < 1)
    })
  })

})

describe('Replace prepared conditions: ', () => {
  it('should replace single prepared condition', () => {
    const expression = 'PREPARED_CONDITION_1'
    const populatedExpression = populatePreparedConditions(expression, preparedConditions)

    populatedExpression.should.equal(preparedConditions.PREPARED_CONDITION_1)
  })

  it('should replace multiple prepared conditions', () => {
    const expression = 'PREPARED_CONDITION_1 && PREPARED_CONDITION_2'
    const populatedExpression = populatePreparedConditions(expression, preparedConditions)

    populatedExpression.should.equal(`${preparedConditions.PREPARED_CONDITION_1} && ${preparedConditions.PREPARED_CONDITION_2}`)
  })

  it('should not replace prepared condition inside text literals', () => {
    const expression = `someArray contains 'PREPARED_CONDITION_1' && (a == PREPARED_CONDITION_2)`
    const populatedExpression = populatePreparedConditions(expression, preparedConditions)

    populatedExpression.should.equal(`someArray contains 'PREPARED_CONDITION_1' && (a == ${preparedConditions.PREPARED_CONDITION_2})`)
  })

  it('should not replace prepared condition inside object properties level 1', () => {
    const expression = `nestedObject.PREPARED_CONDITION_1 && (a == PREPARED_CONDITION_2)`
    const populatedExpression = populatePreparedConditions(expression, preparedConditions)

    populatedExpression.should.equal(`nestedObject.PREPARED_CONDITION_1 && (a == ${preparedConditions.PREPARED_CONDITION_2})`)
  })

  it('should not replace prepared condition inside object properties level 2', () => {
    const expression = `nestedObject.propertyWithObject.PREPARED_CONDITION_1 && (a == PREPARED_CONDITION_2)`
    const populatedExpression = populatePreparedConditions(expression, preparedConditions)

    populatedExpression.should.equal(`nestedObject.propertyWithObject.PREPARED_CONDITION_1 && (a == ${preparedConditions.PREPARED_CONDITION_2})`)
  })
})
