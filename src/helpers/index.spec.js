import chai from 'chai'
import jsdom from 'mocha-jsdom'
// import _ from 'lodash'
import * as helpers from './index'

chai.should()

describe('Helper Functions', () => {

  describe('getSubtrackAbbreviation', () => {
    const getSubtrackAbbreviation = helpers.getSubtrackAbbreviation

    it('returns the subtrack code given the subtrack constant', () => {
      const code = getSubtrackAbbreviation('BUG_HUNT')

      code.should.equal('BH')
    })

    it('returns the default O for "other" if no subtrack is found', () => {
      const defaultCode = getSubtrackAbbreviation('mySubtrackName')

      defaultCode.should.equal('O')
    })
  })

  describe('isEndOfScreen', () => {
    // jsdom()

    const isEndOfScreen = helpers.isEndOfScreen

    it('calls the callback with any number of arguments passed in', () => {
      window.innerHeight = 20
      window.scrollY     = 20

      document.body.offsetHeight = 0

      const myCallback = (...myArgs) => {
        myArgs.length.should.equal(3)
      }

      isEndOfScreen(myCallback, 1, 2, 3)
    })
  })

  describe('getRoundedPercentage', () => {
    const getRoundedPercentage = helpers.getRoundedPercentage

    it('returns a rounded number with % sign given a number', () => {
      getRoundedPercentage(0).should.equal('0%')
      getRoundedPercentage(1).should.equal('1%')
      getRoundedPercentage(3.49).should.equal('3%')
      getRoundedPercentage(3.5).should.equal('4%')
    })
    it('returns an empty string if input is not a number', () => {
      getRoundedPercentage('3.5').should.equal('')
    })
  })

  describe('numberWithCommas', () => {
    const numberWithCommas = helpers.numberWithCommas

    it('adds commas to numbers', () => {
      numberWithCommas(5).should.equal('5')
      numberWithCommas(5000).should.equal('5,000')
      numberWithCommas('1,234,000').should.equal('1,234,000')
    })
  })

  describe('singlePluralFormatter', () => {
    const singlePluralFormatter = helpers.singlePluralFormatter

    it('returns an empty string if there are zero items', () => {
      singlePluralFormatter(0).should.equal('')
    })

    it('returns 1 and a singluar noun if given the number 1', () => {
      singlePluralFormatter(1, 'nyan cat').should.equal('1 nyan cat')
    })

    it('returns any other number with the plural noun', () => {
      singlePluralFormatter(3, 'nyan cat').should.equal('3 nyan cats')
    })
  })
})
