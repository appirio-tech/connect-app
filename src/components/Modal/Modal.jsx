import React from 'react'
import PropTypes from 'prop-types'
import './Modal.scss'
import cn from 'classnames'
import BtnClose from '../../assets/icons/x-mark-big.svg'

/**
 * @params {string} classname
 */
const IconBtnClose = ({ className }) => {
  return <BtnClose className={className}/>    
}

IconBtnClose.propTypes = {
  className: PropTypes.string.isRequired
}

const Modal = ({children, className, onClose}) => (
  <div className={cn('modal', className)}>
    <a href="javascript:" onClick={onClose} className="btn-close">
      <IconBtnClose className="btn-close" />
    </a>
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
