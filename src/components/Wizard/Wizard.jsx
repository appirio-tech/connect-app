import React from 'react'
import PT from 'prop-types'
import ModalControl from '../ModalControl'
import TailLeft from '../../assets/icons/arrows-16px-1_tail-left.svg'
import XMark from '../../assets/icons/x-mark.svg'
import './Wizard.scss'

/**
 * @params {string} class name
 */
const IconXMark = ({ className }) => {
  return <XMark className={className}/>
}

IconXMark.propTypes = {
  className: PT.string.isRequired
}

/**
 * @params {string} class name
 */
const IconTailLeft = ({ className }) => {
  return <TailLeft className={className}/>
}

IconTailLeft.propTypes = {
  className: PT.string.isRequired
}

function Wizard(props) {
  const { step, shouldRenderBackButton, onStepChange, showModal, onCancel } = props
  let backControl
  let modalCloseControl
  if (step && (!shouldRenderBackButton || shouldRenderBackButton(step))) {
    backControl = (
      <ModalControl
        className="back-button"
        icon={<IconTailLeft className="icon-tail-left"/>}
        label="back"
        onClick={() => onStepChange(step - 1)}
      />
    )
  }
  if (showModal) {
    modalCloseControl = (
      <ModalControl
        className="escape-button"
        icon={<IconXMark className="icon-x-mark"/>}
        label="esc"
        onClick={ onCancel }
      />
    )
  }
  return (
    <div className={`Wizard ${props.className}`}>
      <div className="content">
        {backControl}
        { modalCloseControl }
        {props.children[step]}
      </div>
    </div>
  )
}

Wizard.proptTypes = {
  children: PT.node.isRequired,
  onCancel: PT.node.isRequired,
  onStepChange: PT.func.isRequired,
  step: PT.number.isRequired,
  showModal: PT.bool,
  shouldRenderBackButton: PT.func
}

export default Wizard
