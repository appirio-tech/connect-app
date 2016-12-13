import SearchBar from './SearchBar'
import React from 'react'

const recentTerms = ['Photoshop', 'IBM Bluemix', 'Sketch', 'iOS Icon Design Challenges', 'React.js']

const handleTermChange = (oldTerm, searchTerm, reqNo, callback) => {
  const suggestions = []
  setTimeout(() => {
    if (searchTerm && 'java'.indexOf(searchTerm.toLowerCase()) !== -1) {
      suggestions.push('Java')
      suggestions.push('JavaScript')
    } else if (searchTerm && 'javascript'.indexOf(searchTerm.toLowerCase()) !== -1) {
      suggestions.push('JavaScript')
    } else if (searchTerm && 'coffee'.indexOf(searchTerm.toLowerCase()) !== -1) {
      suggestions.push('Coffee')
      suggestions.push('CoffeeScript')
    } else if (searchTerm && 'coffeescript'.indexOf(searchTerm.toLowerCase()) !== -1) {
      suggestions.push('CoffeeScript')
    }
    callback.apply(null, [reqNo, suggestions])
  }, Math.floor((Math.random() * 1000) + 800))
}

const search = (term) => {
  console.log('Searched for term: ' + term)
}

const SearchBarExamples = () => (
  <SearchBar recentTerms={recentTerms} onTermChange={handleTermChange} onSearch={ search } />
)

module.exports = SearchBarExamples
