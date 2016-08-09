import React, { PropTypes } from 'react'

const PaginationBar = (props) => {
  console.log(props)
  return (
    <div className="pages">
      <nav className="right-page">
        <a href="javascript:;" className="btn-prev">Prev</a>
        <ul>
          <li><a href="javascript:;">1</a></li>
          <li className="active"><a href="javascript:;">2</a></li>
          <li><a href="javascript:;">3</a></li>
          <li>
            <a href="javascript:;" className="link-more">...</a>
              <div className="down-layer hide">
                <span className="txt">Go to page:</span>
                <span className="inputs">
                  <input type="text" value="12" />
                </span>
              </div>
          </li>
          <li><a href="javascript:;">20</a></li>
        </ul>
        <a href="javascript:;" className="btn-next">Next</a>
      </nav>
    </div>
  )
}

PaginationBar.PropTypes = {
  totalCount: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  currentPageNum: PropTypes.number.isRequired
}

export default PaginationBar
