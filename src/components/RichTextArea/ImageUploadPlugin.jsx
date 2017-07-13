import { EditorState } from 'draft-js'
import Uploader from 'html5-uploader'
import addImage from 'draft-js-image-plugin/lib/modifiers/addImage'
import Alert from 'react-s-alert'

import { getToken } from '../../api/requestInterceptor'
import { CONNECT_MESSAGE_API_URL } from '../../config/constants'

Uploader.prototype._attach = () => {}
Uploader.prototype._getElement = () => ({tagName: 'dummy'})
Uploader.prototype._preview = () => {}

function _doUpload(files, getEditorState, setEditorState, setUploadState) {

  let handled = 0
  for (const key in files) {
    if (files[key] && files[key] instanceof File && /image/.test(files[key].type)) {
      handled++
      getToken().then((token) => {
        const uploader = new Uploader({
          method: 'POST',
          name: 'file',
          url: `${CONNECT_MESSAGE_API_URL}/v4/topics/image`,
          headers: { Authorization: `Bearer ${token}` }
        })
        uploader.on('upload:done', (response) => {
          setUploadState(false)
          const result = JSON.parse(response).result
          if (result && result.content && result.content.url) {
            setEditorState(addImage(getEditorState(), result.content.url))
          } else {
            console.error(response)
            Alert.error('Failed to upload image')
          }
        })
        uploader.on('upload:progress', (progress) => {
          setUploadState(Math.max(1, progress))
        })
        uploader.on('error', (err) => {
          setUploadState(false)
          console.error(err)
          Alert.error(`Failed to upload image: ${err.message}`)
        })
        uploader._read([files[key]])
        setUploadState(1)
        uploader.upload()
      })
    }
  }
  return handled === files.length ? 'handled' : 'not-handled'
}

function handlePastedFiles(files, { getEditorState, setEditorState, getProps }) {
  return _doUpload(files, getEditorState, setEditorState, getProps().setUploadState)
}

function handleDroppedFiles(selection, files, { getEditorState, setEditorState, getProps }) {
  setEditorState(EditorState.acceptSelection(getEditorState(), selection))
  return _doUpload(files, getEditorState, setEditorState, getProps().setUploadState)
}

export default {
  handlePastedFiles,
  handleDroppedFiles
}