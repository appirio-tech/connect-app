
import handleInternalDrop from 'draft-js-drag-n-drop-plugin/lib/handleDrop'
import {convertFromHTML, EditorState, AtomicBlockUtils, BlockMapBuilder, Modifier} from 'draft-js'
import Immutable from 'immutable'

const blockRenderMap = new Immutable.Map({
  atomic: {
    element: 'figure',
    aliasedElements: ['img']
  }
})

function handleDrop(selection, dataTransfer, dragType, props) {
  if (dragType === 'internal') {
    // Internal drag & drop, like moving image around within the editor
    return handleInternalDrop(selection, dataTransfer, dragType, props)
  }

  // For drop html content came from outside the editor
  const html = dataTransfer.getHTML()

  if (html) {
    const editor = props.getEditorRef()
    const editorState = props.getEditorState()

    const htmlFragment = convertFromHTML(html, undefined, editor.props.blockRenderMap.merge(blockRenderMap))

    if (htmlFragment) {
      const contentBlocks = htmlFragment.contentBlocks
      const entityMap = htmlFragment.entityMap

      if (contentBlocks) {
        if (contentBlocks.length === 1 && contentBlocks[0].getType() === 'atomic') {
          const entity = entityMap.get(contentBlocks[0].getEntityAt(0))
          // The draft-js-image-plugin currently only handle lowercase 'image' entity type
          if (entity.getType().toLowerCase() === 'image') {
            const contentState = editorState.getCurrentContent()
            const contentStateWithEntity = contentState.createEntity('image', 'IMMUTABLE', { src: entity.getData().src })
            const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
            const newEditorState = AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, ' ')
            props.setEditorState(newEditorState)
            return 'handled'
          }
        }

        const htmlMap = BlockMapBuilder.createFromArray(contentBlocks)
        let newContentState = Modifier.replaceWithFragment(editorState.getCurrentContent(), editorState.getSelection(), htmlMap)
        newContentState = newContentState.set('entityMap', entityMap)
        props.setEditorState(EditorState.push(editorState, newContentState, 'insert-fragment'))

        return 'handled'
      }
    }
  }
  return 'not-handled'
}

export default {
  handleDrop
}