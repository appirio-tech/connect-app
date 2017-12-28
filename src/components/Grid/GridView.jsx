import React from 'react'
import PropTypes from 'prop-types'
import ListHeader from './ListHeader'
import ListItem from './ListItem'
import PaginationBar from './PaginationBar'
import Placeholder from './Placeholder'
import InfiniteScroll from 'react-infinite-scroller'
import LoadingIndicator from '../../components/LoadingIndicator/LoadingIndicator'
import { PROJECTS_LIST_PER_PAGE } from '../../config/constants'
import './GridView.scss'


const GridView = props => {
  const { columns, sortHandler, currentSortField, ListComponent, resultSet, onPageChange, projectsStatus,
    totalCount, pageSize, currentPageNum, infiniteScroll, infiniteAutoload, isLoading, setInfiniteAutoload } = props
  const paginationProps = { totalCount, pageSize, currentPageNum, onPageChange }
  const headerProps = { columns, sortHandler, currentSortField }

  const renderItem = (item, index) => {
    return item.isPlaceholder ? <Placeholder columns={columns} /> : <ListComponent columns={columns} item={item} key={index}/>
  }

  const handleLoadMore = () => {
    onPageChange(currentPageNum + 1)
    setInfiniteAutoload(true)
  }

  const renderGridWithPagination = () => (
    isLoading ? (
      <LoadingIndicator />
    ) : (
      <div className="container">
        {resultSet.length ? (
          <div className="flex-area">
            <div className="flex-data">
              <ListHeader {...headerProps} />
              {resultSet.map(renderItem)}
            </div>
            <PaginationBar {...paginationProps} />
          </div>
        ) : (
          <div className="flex-area">
            {/* TODO replace this with proper style */}
            <div style={{textAlign: 'center'}}><br/><br/><h3> No results </h3><br/><br/></div>
          </div>
        )}
      </div>
    )
  )

  const renderGridWithInfiniteScroll = () => {
    const hasMore = currentPageNum * PROJECTS_LIST_PER_PAGE < totalCount
    const placeholders = []
    if (isLoading & hasMore) {
      for (let i = 0; i < PROJECTS_LIST_PER_PAGE; i++) {
        placeholders.push({ isPlaceholder: true })
      }
    }
    return (
      isLoading && currentPageNum === 1 ? (
        <LoadingIndicator />
      ) : (
        <div>
          <div className="container">
            <div className="flex-area">
              <div className="flex-data">
                <ListHeader {...headerProps} />
                <InfiniteScroll
                  initialLoad={false}
                  pageStart={currentPageNum}
                  loadMore={infiniteAutoload && !isLoading ? onPageChange : () => {}}
                  hasMore={hasMore}
                  threshold={500}
                >
                  {[...resultSet, ...placeholders].map(renderItem)}
                </InfiniteScroll>
              </div>
            </div>
          </div>
          { false && isLoading && <LoadingIndicator /> }
          { !isLoading && !infiniteAutoload && hasMore &&
            <div className="gridview-load-more">
              <button type="button" className="tc-btn tc-btn-primary" onClick={handleLoadMore} key="loadMore">Load more projects</button>
            </div>
          }
          { !isLoading && !hasMore && <div key="end" className="gridview-no-more">No more {projectsStatus} projects</div>}
        </div>
      )
    )
  }

  return (
    <section className="content gridview-content">
      {infiniteScroll ? renderGridWithInfiniteScroll() : renderGridWithPagination()}
    </section>
  )
}

GridView.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  onPageChange: PropTypes.func.isRequired,
  sortHandler: PropTypes.func.isRequired,
  currentSortField: PropTypes.string.isRequired,
  ListComponent: PropTypes.func,
  resultSet: PropTypes.arrayOf(PropTypes.object).isRequired,
  totalCount: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  currentPageNum: PropTypes.number.isRequired,
  infiniteAutoload: PropTypes.bool,
  infiniteScroll: PropTypes.bool,
  setInfiniteAutoload: PropTypes.func
}

GridView.defaultProps = {
  infiniteScroll: false,
  ListComponent: ListItem
}
export default GridView
