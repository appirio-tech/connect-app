import React, { PropTypes } from 'react'
import cn from 'classnames'
import _ from 'lodash'
import { branch, renderComponent } from 'recompose'
import { Tooltip } from 'appirio-tech-react-components'

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

const GoToPagePill = ({minPage, maxPage, changePage}) => {
  const handleChange = (evt) => {
    console.log(evt.target)
  }
  return (
    <li className="go-to-page-pill">
      <Tooltip popMethod="click">
        <div className="tooltip-target"><span>...</span></div>
        <div className="tooltip-body">
          <div>Go To: <input type="text" onChange={handleChange} /></div>
        </div>
      </Tooltip>
    </li>
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
  const pagePills = []
  const pagesBeforeCurrent = currentPageNum - 1 - 1
  const pagesAfterCurrent = pages - currentPageNum - 1
  if (currentPageNum > 1) {
    pagePills.push(<PagePill key={1} pageNum={ 1 } onPageClick={handlePageSelection} currentPageNum={currentPageNum} />)
  }
  
  pagePills.push(<PagePill key={currentPageNum} pageNum={ currentPageNum } onPageClick={handlePageSelection} currentPageNum={currentPageNum} />)
  
  if (currentPageNum < pages) {
    pagePills.push(<PagePill key={pages} pageNum={ pages } onPageClick={handlePageSelection} currentPageNum={currentPageNum} />)
  }
  const remainingPillsLeft = Math.ceil((5 - pagePills.length) / 2)
  
  if (pagesBeforeCurrent > 0) {
    for(let i=1; i <= remainingPillsLeft && i <= pagesBeforeCurrent; i++) {
      pagePills.splice(1, 0, <PagePill key={ currentPageNum - i } pageNum={ currentPageNum - i } onPageClick={handlePageSelection} currentPageNum={currentPageNum} />)
    }
  }

  const remainingPillsRight = 5 - pagePills.length
  
  if (pagesAfterCurrent > 0) {
    for(let i=1; i <= remainingPillsRight && i <= pagesAfterCurrent; i++) {
      pagePills.splice(pagePills.length - 1, 0, <PagePill key={ currentPageNum + i } pageNum={ currentPageNum + i } onPageClick={handlePageSelection} currentPageNum={currentPageNum} />)
    }
  }
  if (pagesBeforeCurrent - remainingPillsLeft > 0) {
    pagePills.splice(1, 0, <GoToPagePill />)
  }
  if (pagesAfterCurrent - remainingPillsRight > 0) {
    pagePills.splice(pagePills.length - 1, 0, <GoToPagePill />)
  }
  return (
    <div className="pages">
      <nav className="right-page">
        { currentPageNum > 1 && <a href="javascript:" onClick={handlePageSelection} className="btn-prev">Prev</a> }
        <ul>
          { pagePills.map(pagePill => pagePill)}
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
