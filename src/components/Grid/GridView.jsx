import React, { PropTypes } from 'react'
import ListHeader from './ListHeader'
import ListItem from './ListItem'
import PaginationBar from './PaginationBar'
import './GridView.scss'


const GridView = props => {
  const { columns, sortHandler, currentSortFields, ListComponent, resultSet, listItemPropName } = props
  const { totalCount, pageSize, currentPageNum } = props
  const paginationProps = { totalCount, pageSize, currentPageNum }
  const headerProps = {
    headers: columns,
    sortHandler,
    currentSortFields
  }

  const renderItem = (item, index) => {
    return <ListComponent columns={columns} item={item} key={index}/>
  }

  // TODO replace this with proper style
  const emptyList = <div style={{textAlign: 'center'}}><br/><br/><h3> No results </h3><br/><br/></div>

  return (
    <section className="content all-projects-content">
      <div className="container">
        <div className="flex-area">
          <div className="flex-data">
            <ListHeader {...headerProps} />

            { resultSet.length ? resultSet.map(renderItem) : emptyList }
          </div>
          {/* .flex-data */}

          { resultSet.length ? <PaginationBar {...paginationProps} /> : <noscript /> }

        </div>
        {/* .flex-area */}
      </div>
      {/* .container */}
    </section>

  )
}

GridView.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  sortHandler: PropTypes.func.isRequired,
  currentSortFields: PropTypes.arrayOf(PropTypes.object).isRequired,
  ListComponent: PropTypes.func,
  resultSet: PropTypes.arrayOf(PropTypes.object).isRequired,
  totalCount: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  currentPageNum: PropTypes.number.isRequired,
}

GridView.defaultProps = {
  ListComponent: ListItem
}
export default GridView
