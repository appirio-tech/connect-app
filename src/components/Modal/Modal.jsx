import React, {PropTypes} from 'react'
import './Modal.scss'
import cn from 'classnames'

const Modal = ({children, className, onClose}) => (
  <div className={cn('modal', className)}>
    <a href="javascript:" onClick={onClose} className="btn-close"/>
    {children}
  </div>
)
Modal.propTypes = {
  children: PropTypes.any.isRequired,
  onClose: PropTypes.func.isRequired,
  className: PropTypes.string
}

const Title = ({children}) => (
  <div className="modal-title title-muted">
    {children}
  </div>
)
Title.propTypes = {
  children: PropTypes.any.isRequired
}

const Body = ({children}) => (
  <div className="modal-body">
    {children}
  </div>
)
Body.propTypes = {
  children: PropTypes.any.isRequired
}

Modal.Title = Title
Modal.Body = Body

export default Modal
