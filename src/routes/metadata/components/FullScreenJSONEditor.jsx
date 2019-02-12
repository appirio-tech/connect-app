import React from 'react'
// import JSONInput from 'react-json-editor-ajrm'
// import locale    from 'react-json-editor-ajrm/locale/en'

import MobilePage from '../../../components/MobilePage/MobilePage'
import './FullScreenJSONEditor.scss'

const FullScreenJSONEditor = ({
  // onJSONEdit,
  onExit,
  // json
}) => (
  <MobilePage keepToolbar>
    <div styleName="full-screen-json-editor">
      <button type="button" className="tc-btn tc-btn-primary tc-btn-sm" onClick={onExit}>Restore</button>
      {/* <JSONInput
        id="jsonField"
        placeholder ={ json }
        theme="dark_vscode_tribute"
        locale={ locale }
        height="100%"
        width="100%"
        onChange={onJSONEdit}
        // onKeyPressUpdate={false}
        waitAfterKeyPress={3000} */}
      />
    </div>
  </MobilePage>
)

export default FullScreenJSONEditor
