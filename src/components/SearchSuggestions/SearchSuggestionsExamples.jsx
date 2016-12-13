import React from 'react'
import SearchSuggestions from './SearchSuggestions'

const recentList = ['Photoshop', 'IBM Bluemix', 'Sketch', 'iOS Icon Design Challenges', 'React.js']
const popularList = ['Java', 'Javascript', 'CoffeeScript']

const handleSelection = (selectedTerm) => {
  console.log('Selected term: ' + selectedTerm)
}

const SearchSuggestionsExamples = () => {
  return (
		<section>
			<SearchSuggestions recentSearch={ recentList } popularSearch={ popularList } onSuggestionSelect={ handleSelection } />
			<SearchSuggestions recentSearch={ recentList } onSuggestionSelect={ handleSelection } />
			<SearchSuggestions popularSearch={ popularList } onSuggestionSelect={ handleSelection } />
		</section>
	)
}

module.exports = SearchSuggestionsExamples