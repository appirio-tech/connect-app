require('./SearchSuggestions.scss')

import React, { Component, PropTypes } from 'react'
import StandardListItem from '../StandardListItem/StandardListItem'
import Panel from '../Panel/Panel'
import classNames from 'classnames'

// properties: onSuggestionSelect, recentSearch, popularList
class SearchSuggestions extends Component {
  constructor(props) {
    super(props)

    this.state = { iSEmpty: true }
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(evt) {
    const term = evt.currentTarget.getAttribute('data-term')
    evt.stopPropagation()
    this.props.onSuggestionSelect.apply(this, [term])
  }

  render() {
    const recentList = this.props.recentSearch
    const popularList = this.props.popularSearch
    const suggestionItem = (term, i) => {
      let labelDOM = term
      const searchTerm = this.props.searchTerm
      let exactMatch = false
      if (searchTerm.length > 0) {
        const idx = term.toLowerCase().indexOf(searchTerm.toLowerCase())
        if (idx !== -1) {
          // check if exact match
          exactMatch = idx === 0 && term.length === searchTerm.length
          // prepare DOM for the content to be rendered under StandardListItem
          labelDOM = (
            <span className={ itemClasses }>
              { term.substring(0, idx) }
              <strong>{ searchTerm }</strong>
              { term.substring(idx + searchTerm.length) }
            </span>
          )
        }
      }
      // prepares css class for li
      const itemClasses = classNames(
        { selected : exactMatch }
      )
      // prepares and returns the DOM for each popular/recent search item
      return (
        <li key={ i } data-term={term} onClick={ this.handleClick } className={ itemClasses }>
          <StandardListItem labelText={ labelDOM } showIcon={ false } />
        </li>
      )
    }

    const recentSearches = !recentList ? '' : (
			<div className="recent-search-suggestions">
				<Panel showHeader={this.props.showPopularSearchHeader}>
					<div className="panel-header">
						<div className="label">Recent Search</div>
						<div className="recent-search-panel-actions transition">
							<div className="recent-search-panel-action">
								<a href="javascript:;">Edit</a>
							</div>
						</div>
					</div>
					<div className="panel-body">
						<ul className="search-suggestion-result-list">
							{	recentList.map(suggestionItem) }
						</ul>
							{
								popularList.length !== 0 ? '' :  (
									<a href="javascript:;" className="footer-link transition">
										Learn more about the new Search here
									</a>
								)
							}
					</div>
				</Panel>
			</div>
		)

    const popularSearch = !popularList ? '' :(
			<div className="popular-search-suggestions">
				<Panel showHeader={this.props.showPopularSearchHeader}>
					<div className="panel-header">
						<div className="label">Popular</div>
					</div>
					<div className="panel-body">
						<ul className="search-suggestion-result-list">
							{ popularList.map(suggestionItem) }
						</ul>
					</div>
				</Panel>
			</div>
		)
    const ssClasses = classNames(
      'SearchSuggestions',
      { 'empty-state' : recentList && !popularList }
    )

    const hide = this.props.hideSuggestionsWhenEmpty &&
        (!recentList || !recentList.length) &&
        (!popularList || !popularList.length)

    return hide ? (<div></div>) : (
			<div className={ ssClasses }>
				{ popularSearch }
				{ recentSearches }
			</div>
		)
  }
}

SearchSuggestions.propTypes = {
  hideWhenEmpty         : PropTypes.bool,
  onSuggestionSelect    : PropTypes.func.isRequired,
  recentSearch          : PropTypes.array,
  popularSearch         : PropTypes.array,
  searchTerm            : PropTypes.string,
  showPopularSearchHeader: PropTypes.bool
}

SearchSuggestions.defaultProps = {
  hideWhenEmpty         : true,
  recentSearch          : [],
  popularSearch         : [],
  searchTerm            : '',
  showPopularSearchHeader: true
}

export default SearchSuggestions
