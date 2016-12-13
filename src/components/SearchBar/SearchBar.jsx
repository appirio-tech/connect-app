require('./SearchBar.scss')

import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
import SearchSuggestions from '../SearchSuggestions/SearchSuggestions'
import Loader from '../Loader/Loader'
import classNames from 'classnames'

//states: empty, filled, focused

class SearchBar extends Component {
  constructor(props) {
    super(props)
    const initialTerm = this.getQueryStringValue(props.searchTermKey)
    this.state = {
      searchState: initialTerm.length > 0 ? 'filled' : 'empty',
      suggestions: [],
      searchValue: initialTerm,
      finalTerm: initialTerm
    }
    this.onFocus = this.onFocus.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onKeyUp = this.onKeyUp.bind(this)
    this.clearSearch = this.clearSearch.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.search = this.search.bind(this)
    this.handleSuggestionSelect = this.handleSuggestionSelect.bind(this)
    this.handleOutsideClick = this.handleOutsideClick.bind(this)
    this.handleSuggestionsUpdate = this.handleSuggestionsUpdate.bind(this)
  }

  getQueryStringValue (key) {
    return unescape(window.location.href.replace(new RegExp('^(?:.*[&\\?]' + escape(key).replace(/[\.\+\*]/g, '\\$&') + '(?:\\=([^&]*))?)?.*$', 'i'), '$1'))
  }

  componentDidMount() {
    window.addEventListener('click', this.handleOutsideClick)
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleOutsideClick)
  }

  handleOutsideClick(evt) {
    let t = evt.target
    let i = 0
    const searchBarNode = ReactDOM.findDOMNode(this)
    let clickedInside = false
    while(t !== null && i < 10) {
      i++
      if (t === searchBarNode) {
        clickedInside = true
        break
      }
      t = t.parentNode
    }
    if (!clickedInside) {
      if(this.state.searchValue) {
        this.setState({ searchState: 'filled' })
      } else {
        if (this.state.finalTerm && this.state.finalTerm.trim().length > 0) {
          this.setState({ searchState: 'filled', searchValue: this.state.finalTerm })
        } else {
          this.setState({ searchState: 'empty' })
        }
      }
    }
  }

  onFocus() {
    this.setState({ searchState: 'focused' })
  }

  handleSuggestionsUpdate(requestNo, data) {
    if (requestNo === this.state.maxRequestNo) {
      console.log('SUGGESTIONS', data)
      this.setState({loading: false, suggestions: data, selectedSuggestionIdx: null})
    }
  }

  onChange() {
    const oldTerm = this.state.searchValue
    const newTerm = this.refs.searchValue.value ? this.refs.searchValue.value.trim() : ''
    this.setState(
      function(prevState) {
        const rc = prevState.requestNo ? prevState.requestNo + 1 : 1
        return {
          searchValue: this.refs.searchValue.value,
          requestNo: rc,
          maxRequestNo: rc,
          loading: newTerm.length > 0,
          searchState: 'focused'
        }
      },
      function() {
        if (newTerm.length > 0) {
          this.props.onTermChange.apply(null, [
            oldTerm,
            newTerm,
            this.state.requestNo,
            this.handleSuggestionsUpdate
          ])
        }
      }
    )
  }

  clearSearch() {
    this.refs.searchValue.value = ''
    this.setState({ searchValue: this.refs.searchValue.value, finalTerm: '' })
    this.setState({ searchState: 'empty' })
    this.setState({ suggestions: false })
    this.props.onClearSearch()
  }

  onKeyUp(evt) {
    const eventKey = evt.keyCode
    evt.stopPropagation()
    evt.preventDefault()
    // if return is pressed
    if (eventKey === 13) {
      this.setState({ searchState: 'filled', finalTerm: this.state.searchValue }, function() {
        this.search()
      })
    } else if (eventKey === 39) { // right arrow key is pressed
      const suggestion = this.state.suggestions[0]
      if (suggestion) {
        this.refs.searchValue.value = suggestion
        // trigger the change event handler
        this.onChange()
      }
    } else if (eventKey === 38) { // up arrow key
      const currSelectedIdx = this.state.selectedSuggestionIdx
      if (currSelectedIdx) { // index is none of (undefined, null, 0)
        const suggestionIdx = currSelectedIdx - 1
        const suggestion = this.state.suggestions[suggestionIdx]
        this.refs.searchValue.value = suggestion
        this.setState({
          selectedSuggestionIdx : suggestionIdx,
          searchValue: suggestion
        })
      }
    } else if (eventKey === 40) { // down arrow key
      const currSelectedIdx = this.state.selectedSuggestionIdx
       // index is none of (undefined, null, 0)
      if (typeof currSelectedIdx === 'undefined'
        || currSelectedIdx === null
        || this.state.suggestions.length > currSelectedIdx + 1) {
        const suggestionIdx = typeof currSelectedIdx === 'number' ? currSelectedIdx + 1 : 0
        const suggestion = this.state.suggestions[suggestionIdx]
        this.refs.searchValue.value = suggestion
        this.setState({
          selectedSuggestionIdx: suggestionIdx,
          searchValue: suggestion
        })
      }
    }
  }

  handleSuggestionSelect(selectedTerm) {
    this.setState({ searchValue: selectedTerm, searchState: 'filled' }, function() {
      this.search()
    })
  }

  search() {
    const searchTerm = this.state.finalTerm ? this.state.finalTerm.trim() : ''
    if(searchTerm.length > 0) {
      this.props.onSearch.apply(this, [searchTerm])
    }
  }

  handleClick() {
    if(this.state.searchValue.length > 0) {
      this.setState({  searchState: 'filled', finalTerm: this.state.searchValue }, () => {
        this.search()
      })
    }
  }

  render() {
    const recentList = this.props.recentTerms
    const popularList = this.state.suggestions

    const searchState = this.state.searchState
    const searchValue = this.state.searchValue

    let typeaheadText = ''

    if(searchValue) {
      for(let i = 0; i < popularList.length; i++) {
        const idx = popularList[i].toLowerCase().indexOf(searchValue.toLowerCase())
        // show typeahead hint only if the search term matched at 0 index
        if(!typeaheadText && idx === 0) {
          typeaheadText = searchValue + popularList[i].substring(searchValue.length)
        }
      }
    } else {
      typeaheadText = ''
    }

    const sbClasses = classNames('SearchBar', {
      'state-empty' : searchState === 'empty',
      'state-focused': searchState === 'focused',
      'state-filled' : searchState === 'filled'
    })

    const results = this.state.loading === true
      ? <div className="loading-suggestions"><Loader /></div>
      : <SearchSuggestions hideSuggestionsWhenEmpty={ this.props.hideSuggestionsWhenEmpty } recentSearch={ recentList } searchTerm={ this.state.searchValue } popularSearch={ popularList } showPopularSearchHeader={ this.props.showPopularSearchHeader } onSuggestionSelect={ this.handleSuggestionSelect } />
    return (
      <div className={ sbClasses }>
        <span className="search-typeahead-text">{ typeaheadText }</span>
        <input className="search-bar__text" onFocus={ this.onFocus } onChange={ this.onChange } onKeyUp={ this.onKeyUp } ref="searchValue" value={this.state.searchValue} />
        <img className="search-bar__clear" src={ require('./x-mark.svg') } onClick={ this.clearSearch }/>
        <div className="search-icon-wrap" onClick={ this.handleClick }>
          <span className="search-txt">Search</span>
        </div>
        <div className="suggestions-panel">
          {results}
        </div>
      </div>
    )

  }
}

SearchBar.propTypes = {
  hideSuggestionsWhenEmpty: PropTypes.bool,
  onSearch     : PropTypes.func.isRequired,
  onClearSearch : PropTypes.func,
  onTermChange : PropTypes.func.isRequired,
  recentTerms  : PropTypes.array,
  searchTermKey: PropTypes.string,
  showPopularSearchHeader: PropTypes.bool
}

SearchBar.defaultProps = {
  hideSuggestionsWhenEmpty: false,
  recentTerms   : [],
  searchTermKey : 'q',
  onClearSearch : () => {},
  showPopularSearchHeader: true
}

export default SearchBar
