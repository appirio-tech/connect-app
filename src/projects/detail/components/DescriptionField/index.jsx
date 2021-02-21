import React from 'react'

import Editor from '../../../../components/TuiEditor'

const DescriptionField = (props) => (
  <Editor
    {...props}
    previewStyle="vertical"
    height="400px"
    initialEditType="wysiwyg"
    initialValue={props.value}
  />
)

export default DescriptionField
