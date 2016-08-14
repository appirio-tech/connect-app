import React, { PropTypes } from 'react'
import cn from 'classnames'
import _ from 'lodash'
import { branch, renderComponent } from 'recompose'

const noop = () => <noscript />
/**
 * HOC to help determine if pagination should be shown or not
 */
const identity = t => t
const showPagination = (hasPages) =>
 branch (hasPages, identity, renderComponent(noop))
const enhance = showPagination( ({totalCount, pageSize}) =>
  Math.ceil(totalCount / pageSize) > 1)

/**
 * Renders each page number div
 */
const PagePill = ({pageNum, onPageClick, currentPageNum}) => {
  const _onClick = () => onPageClick(pageNum)
  const activeClass = cn({
    active: currentPageNum === pageNum
  })
  return (
    <li className={activeClass}><a href="javascript:" onClick={_onClick}>{pageNum}</a></li>
  )
}

/**
 * Pagingation bar
 */
const PaginationBar = enhance(({onPageChange, currentPageNum, totalCount, pageSize}) => {
  const handlePageSelection = val => {
    // if it's a number then call handler
    if (currentPageNum !== val && _.isNumber(val)) onPageChange(val)
    // val must be an event-  handle prev / next
    val = val.target.innerText.toLowerCase()
    if (val === 'prev') onPageChange(currentPageNum-1)
    if (val === 'next') onPageChange(currentPageNum+1)
  }


  // calculate number of pages to show
  const pages = Math.ceil(totalCount / pageSize)
  return (
    <div className="pages">
      <nav className="right-page">
        { currentPageNum > 1 && <a href="javascript:" onClick={handlePageSelection} className="btn-prev">Prev</a> }
        <ul>
          { _.range(pages).map(idx =>
            <PagePill key={idx} pageNum={idx+1} onPageClick={handlePageSelection} currentPageNum={currentPageNum} />
          )}
        </ul>
        { currentPageNum < pages && <a href="javascript:" onClick={handlePageSelection} className="btn-next">Next</a> }
      </nav>
    </div>
  )
})

PaginationBar.PropTypes = {
  totalCount: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  currentPageNum: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired
}

export default PaginationBar
