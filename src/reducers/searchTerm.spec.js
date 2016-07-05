import searchTerm from './searchTerm'
import chai from 'chai'
import freeze from 'deep-freeze-node'

import { SET_SEARCH_TERM, SET_SEARCH_TAG, RESET_SEARCH_TERM } from '../config/constants'

describe('searchTerm reducer', () => {
  const currentState = freeze({ oldState: 'oldState' })

  const action = { type: 'UNCAUGHT_ACTION' }

  it('should return the original state for any action not caught in its switch block', () => {
    const newState = searchTerm(currentState, action)

    newState.should.equal(currentState)
  })

  describe(SET_SEARCH_TERM, () => {
    const currentState = freeze({
      searchTerm: 'darth vader'
    })

    const action = { type: SET_SEARCH_TERM, searchTerm: 'C-3PO' }

    const newState = searchTerm(currentState, action)

    it('should update the saved search term', () => {
      newState.searchTerm.should.equal('C-3PO')
      newState.previousSearchTerm.should.equal('darth vader')
    })
  })

  describe(SET_SEARCH_TAG, () => {
    const currentState = freeze({
      searchTermTag: null
    })

    const action = {
      type: SET_SEARCH_TAG,
      searchTermTag: {
        categories: ['DEVELOP'],
        domain: 'SKILLS',
        id: 247,
        name: 'Java',
        priority: 14,
        status: 'APPROVED'
      }
    }

    const newState = searchTerm(currentState, action)

    it('should update the saved search term tag', () => {
      newState.searchTermTag.should.deep.equal({
        categories: ['DEVELOP'],
        domain: 'SKILLS',
        id: 247,
        name: 'Java',
        priority: 14,
        status: 'APPROVED'
      })
    })
  })

  describe(RESET_SEARCH_TERM, () => {
    const currentState = freeze({
      previousSearchTerm: 'luke skywalker',
      searchTermTag: {}
    })

    const action = { type: RESET_SEARCH_TERM }
    const newState = searchTerm(currentState, action)

    it('should reset previousSearchTerm and searchTermTag to null', () => {
      chai.should().not.exist(newState.previousSearchTerm)
      chai.should().not.exist(newState.searchTermTag)
    })
  })
})
