import React, {PropTypes} from 'react'
import cn from 'classnames'

const BtnSeparator = ({children, onClick, isLoadingComments}) => (
  <div>
    <div className="card-body comment-section">
      <div className={cn("comment-collapse", {'loading-comments': isLoadingComments})}>
        <a href="javascript:" onClick={onClick} className="comment-collapse-button">
          {children}
        </a>
      </div>
    </div>
  </div>
)

BtnSeparator.propTypes = {
  children: PropTypes.any,
  onClick: PropTypes.func.isRequired
}

export default BtnSeparator
