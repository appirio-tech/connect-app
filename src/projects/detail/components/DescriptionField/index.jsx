/*
 *  DescriptionField
 */

import React from 'react'
import PropTypes from 'prop-types'

import TuiEditor from '../../../../components/TuiEditor'
import './DescriptionField.scss'

const DescriptionField = (props) => (
  <TuiEditor
    {...props}
    toolbarItems={[
      'heading',
      'bold',
      'italic',
      'strike',
      'code',
      'divider',
      'quote',
      'codeblock',
      'hr',
      'divider',
      'ul',
      'ol',
      'divider',
      'image',
      'link',
    ]}
    plugins={[]}
    styleName="description-editor"
    previewStyle="vertical"
    height="400px"
    hideModeSwitch
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
