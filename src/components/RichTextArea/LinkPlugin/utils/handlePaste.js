import { EditorState, Modifier } from 'draft-js'

import newLinkifyIt from 'linkify-it'
import tlds from 'tlds'

const linkifyIt = newLinkifyIt()
linkifyIt.tlds(tlds)

/**
 * Handle pasted text
 * @param {string} text - pasted text
 * @param {string} _html - pasted html
 * @param {Object} editorState - current editor state
 * @param {Object} extras - Extra object passed by draft-js-link-editor.
 * @param {function} extras.setEditorState - function to set new editor state.
 */
export default function handlePastedText(
  text,
  _html,
  editorState,
  { setEditorState }
) {
  if (!text) {
    return false
  }

  // parse all the links in the pasted text
  const links = linkifyIt.match(text)
  if (!links) {
    return false
  }

  const contentState = editorState.getCurrentContent()
  const selectionState = editorState.getSelection()
  const cursorPosition = selectionState.getStartOffset()

  let currentContentState = Modifier.insertText(
    contentState,
    selectionState,
    text
  )

  links.forEach(({ index, lastIndex, url }) => {
    const linkText = text.slice(index, lastIndex)

    // Create link entity
    currentContentState = currentContentState.createEntity('LINK', 'MUTABLE', {
      url,
      text: null
    })
    const entityKey = currentContentState.getLastCreatedEntityKey()

    // Select the current link text and replace with link entity
    const linkTextSelection = selectionState.merge({
      anchorOffset: index + cursorPosition,
      focusOffset: lastIndex + cursorPosition,
      isBackward: false
    })
    currentContentState = Modifier.replaceText(
      currentContentState,
      linkTextSelection,
      linkText,
      null,
      entityKey
    )
  })

  // Move cursor to the end of the pasted text
  const newSelectionState = selectionState.merge({
    anchorOffset: cursorPosition + text.length,
    focusOffset: cursorPosition + text.length,
    isBackward: false
  })
  const newEditorState = EditorState.forceSelection(
    EditorState.push(editorState, currentContentState, 'insert-characters'),
    newSelectionState
  )

  setEditorState(newEditorState)
  return 'handled'
}
