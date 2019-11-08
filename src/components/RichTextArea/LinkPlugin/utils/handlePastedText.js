import { EditorState, Modifier, convertFromHTML } from 'draft-js'

import newLinkifyIt from 'linkify-it'
import tlds from 'tlds'

const linkifyIt = newLinkifyIt()
linkifyIt.tlds(tlds)

/**
 * Handle pasted text
 * @param {string} text - pasted text
 * @param {string} html - pasted html
 * @param {Object} lastEditorState - current editor state
 * @param {Object} extras - Extra object passed by draft-js-link-editor.
 * @param {function} extras.setEditorState - function to set new editor state.
 * @param {function} extras.getEditorState - function to get current editor state.
 */
export default function handlePastedText(
  text,
  html,
  lastEditorState,
  { setEditorState, getEditorState }
) {
  if (!text) {
    return false
  }

  // parse all the links in the pasted text
  const links = linkifyIt.match(text)
  if (!links) {
    return false
  }

  // Let the editor render the pasted text before we detect the links
  setTimeout(() => {
    const lastSelectionState = lastEditorState.getSelection()
    const startKey = lastSelectionState.getStartKey()
    let startOffset = lastSelectionState.getStartOffset()

    const newBlocks = html && convertFromHTML(html).contentBlocks
    const pastedLines = text.split('\n').filter(line => line)

    // When we paste formatted text, draftjs pastes it automatically in a new line (i.e., new block)
    const extraBlockInserted =
      newBlocks && newBlocks.length > pastedLines.length

    const currentEditorState = getEditorState()
    const initialSelectionState = currentEditorState.getSelection()
    let currentContentState = currentEditorState.getCurrentContent()
    let currentSelectionState = initialSelectionState

    let currentBlock = extraBlockInserted
      ? currentContentState.getBlockAfter(startKey)
      : currentContentState.getBlockForKey(startKey)
    let currentBlockKey = currentBlock.getKey()
    let currentLine

    for (let i = 0, numLines = pastedLines.length; i < numLines; i++) {
      currentLine = pastedLines[i]

      const linksInLine = linkifyIt.match(currentLine)
      if (linksInLine) {
        linksInLine.forEach(({ index, lastIndex, url }) => {
          // Create the link entity
          currentContentState = currentContentState.createEntity(
            'LINK',
            'MUTABLE',
            {
              url,
              text: null
            }
          )
          const entityKey = currentContentState.getLastCreatedEntityKey()

          // Apply the link entity
          currentSelectionState = currentSelectionState.merge({
            anchorOffset: index + startOffset,
            focusOffset: lastIndex + startOffset,
            anchorKey: currentBlockKey,
            focusKey: currentBlockKey,
            isBackward: false
          })
          currentContentState = Modifier.applyEntity(
            currentContentState,
            currentSelectionState,
            entityKey
          )
        })
      }

      currentBlock = currentContentState.getBlockAfter(currentBlockKey)
      currentBlockKey = currentBlock && currentBlock.getKey()
      startOffset = 0
    }

    // Move cursor to the end of the pasted text
    const newEditorState = EditorState.forceSelection(
      EditorState.push(currentEditorState, currentContentState, 'apply-entity'),
      initialSelectionState
    )

    setEditorState(newEditorState)
  })
}
