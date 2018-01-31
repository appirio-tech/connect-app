import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import _ from 'lodash'
import { branch, renderComponent } from 'recompose'
import { Tooltip } from 'appirio-tech-react-components'
import BtnPrev from '../../assets/icons/arrow-left.svg'
import BtnNext from '../../assets/icons/arrow-left.svg'

const NUMBER_OF_PILLS = 5

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

const GoToPagePill = ({minPage, maxPage, onPageClick}) => {
  const handleChange = (evt) => {
    if (evt.keyCode === 13) {// return key
      onPageClick(parseInt(evt.target.value))
    }
  }
  return (
    <li className="go-to-page-pill">
      <Tooltip popMethod="click" theme="light">
        <div className="tooltip-target"><a href="javascript:">...</a></div>
        <div className="tooltip-body">
          <div className="go-to-page-tooltip">Go to page: <input type="number" min={minPage} max={maxPage} onKeyUp={handleChange} /></div>
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
    if (currentPageNum !== val && _.isNumber(val)) return onPageChange(val)
    // val must be an event-  handle prev / next
    val = val.target.innerText.toLowerCase()
    if (val === 'prev') onPageChange(currentPageNum-1)
    if (val === 'next') onPageChange(currentPageNum+1)
  }

  const renderPill = (pageNum) => {
    return (
      <PagePill
        key={pageNum}
        pageNum={ pageNum }
        onPageClick={handlePageSelection}
        currentPageNum={currentPageNum}
      />
    )
  }

  const populatePills = (pages) => {
    const pagePills = []

    if (pages <= NUMBER_OF_PILLS) {
      for(let p=1; p <= pages; p++) {
        pagePills.push(renderPill(p))
      }
      return pagePills
    }
    // number of pages available to show pills before current page (assuming 1st pill is always there)
    const pagesBeforeCurrent = currentPageNum - 1 - 1
    // number of pages available to show pills after current page (assuming last pill is always there)
    const pagesAfterCurrent = pages - currentPageNum - 1
    // render first page pill
    if (currentPageNum > 1) {
      pagePills.push(renderPill(1))
    }
    // render current page pill
    pagePills.push(renderPill(currentPageNum))
    
    // render last page pill
    if (currentPageNum < pages) {
      pagePills.push(renderPill(pages))
    }
    // array to store the pills to be rendered on the left side of the current page
    const leftPagePills = []
    // initially assumes equal partition between left and right side of the current page
    let remainingPillsLeft = Math.ceil((NUMBER_OF_PILLS - pagePills.length) / 2)
    
    // if pills avialable to render before current page, add pills determined by remainingPillsLeft
    if (pagesBeforeCurrent > 0) {
      for(let i=1; i <= remainingPillsLeft && i <= pagesBeforeCurrent; i++) {
        leftPagePills.splice(0, 0, renderPill(currentPageNum - i))
      }
    }
    // add the left side pills to the main pills array
    pagePills.splice(1, 0, ...leftPagePills)
    // calculates the pills to render on the right side of the current page, it may be greater than the left side pills
    const remainingPillsRight = NUMBER_OF_PILLS - pagePills.length
    
    // if pills available to render after the current page, add pills determined by remainingPillsRight
    if (pagesAfterCurrent > 0) {
      for(let i=1; i <= remainingPillsRight && i <= pagesAfterCurrent; i++) {
        pagePills.splice(pagePills.length - 1, 0, renderPill(currentPageNum + i))
      }
    }
    // Now, checks if we still need to render any pill to show fix number of pills
    remainingPillsLeft = NUMBER_OF_PILLS - pagePills.length
    // adds more pills towards left of the current page
    if(pagesBeforeCurrent - leftPagePills.length - remainingPillsLeft > 0) {
      for(let i=1; i <= remainingPillsLeft; i++) {
        pagePills.splice(1, 0, renderPill(currentPageNum - leftPagePills.length - i))
      }
    }
    // adds go to page pill if there are missing pills between first and current page pill
    if (pagesBeforeCurrent - leftPagePills.length - remainingPillsLeft > 0) {
      pagePills.splice(1,
        0,
        <GoToPagePill
          key="goToPagePill-1"
          onPageClick={ handlePageSelection }
          minPage={currentPageNum - pagesBeforeCurrent + remainingPillsLeft }
          maxPage={currentPageNum}
        />
      )
    }
    // adds go to page pill if there are missing pills between current page and last pill
    if (pagesAfterCurrent - remainingPillsRight > 0) {
      pagePills.splice(pagePills.length - 1,
        0, 
        <GoToPagePill
          key="goToPagePill-2"
          onPageClick={ handlePageSelection }
          minPage={currentPageNum}
          maxPage={ currentPageNum + pagesAfterCurrent - remainingPillsRight}
        />
      )
    }
    return pagePills
  }


  // calculate number of pages to show
  const pages = Math.ceil(totalCount / pageSize)
  const pagePills = populatePills(pages)
  return (
    <div className="pages">
      <nav className="right-page">
        { currentPageNum > 1 && 
        <a href="javascript:" onClick={handlePageSelection}>
          Prev
          <BtnPrev className="btn-prev"/>
        </a>
        }
        <ul>
          { pagePills.map(pagePill => pagePill)}
        </ul>
        { currentPageNum < pages && 
          <a href="javascript:" onClick={handlePageSelection}>
            Next
            <BtnNext className="btn-next"/>
          </a>
        }
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
