import React from 'react'
import PropTypes from 'prop-types'
import { singlePluralFormatter } from '../../helpers'

require('./ListContainer.scss')

const ListContainer = ({ headerText, headerHighlightedText, children, numListItems }) => {
  const listCount = renderListCount(numListItems)

  return (
    <div className="list-container">
      <div className="list-header">
        <span className="header-text">{headerText}
          <span className="highlighted">{headerHighlightedText}</span>
        </span>

        {listCount}
      </div>

      {children}
    </div>
  )

  function renderListCount(numItems) {
    if (numItems) {
      const listCountMessage = singlePluralFormatter(numItems, 'result')

      return <span className="list-count">{` - ${listCountMessage}`}</span>
    }

    return null
  }
}

ListContainer.propTypes = {
  headerText           : PropTypes.string.isRequired,
  headerHighlightedText: PropTypes.string,
  children             : PropTypes.object.isRequired,
  numListItems         : PropTypes.number
}

export default ListContainer
