import React, {PropTypes} from 'react'

const BtnSeparator = ({children, onClick}) => (
  <div>
    <div className="card-body comment-section">
      <div className="comment-collapse">
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
