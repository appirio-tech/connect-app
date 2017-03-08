import React, { PropTypes as PT } from 'react'
import ModalControl from '../ModalControl'
import Icons from '../Icons'
import SVGIconImage from '../SVGIconImage'
import './Wizard.scss'

function Wizard(props) {
  let backControl
  if (props.step) {
    backControl = (
      <ModalControl
        className="back-button"
        icon={<Icons.ArrowBack />}
        label="back"
        onClick={() => props.onStepChange(props.step - 1)}
      />
    )
  }
  return (
    <div className="Wizard">
      <div className="content">
        {backControl}
        <ModalControl
          className="escape-button"
          icon={<SVGIconImage filePath="x-mark" />}
          label="esc"
          onClick={props.onCancel}
        />
        {props.children[props.step]}
      </div>
    </div>
  )
}

Wizard.proptTypes = {
  children: PT.node.isRequired,
  onCancel: PT.node.isRequired,
  onStepChange: PT.func.isRequired,
  step: PT.number.isRequired
}

export default Wizard
