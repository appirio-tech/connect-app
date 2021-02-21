/*
 *  DescriptionField
 */

import React from 'react'
import PropTypes from 'prop-types'

import TuiEditor from '../../../../components/TuiEditor'

const DescriptionField = (props) => (
  <TuiEditor
    {...props}
    previewStyle="vertical"
    height="400px"
    initialEditType="wysiwyg"
    initialValue={props.value}
  />
)


DescriptionField.propTypes = {
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
}

export default DescriptionField
