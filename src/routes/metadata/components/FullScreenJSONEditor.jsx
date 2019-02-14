import React from 'react'

import ace from 'brace'
import 'brace/mode/json'
import 'brace/theme/github'
import { JsonEditor } from 'jsoneditor-react'
// import 'jsoneditor-react/es/editor.min.css'

import MobilePage from '../../../components/MobilePage/MobilePage'
import './FullScreenJSONEditor.scss'

const FullScreenJSONEditor = ({
  onJSONEdit,
  onExit,
  json
}) => (
  <MobilePage keepToolbar>
    <div styleName="full-screen-json-editor">
      <button type="button" className="tc-btn tc-btn-primary tc-btn-sm" onClick={onExit}>Restore</button>
      <JsonEditor
        value={json}
        ace={ace}
        onChange={onJSONEdit}
        allowedModes={ ['code', 'tree', 'view']}
        mode='code'
        theme="ace/theme/github"
        statusBar={true}
      />
    </div>
  </MobilePage>
)

export default FullScreenJSONEditor
