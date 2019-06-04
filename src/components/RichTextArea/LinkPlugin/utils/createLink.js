import { Modifier, EditorState } from 'draft-js'

import newLinkifyIt from 'linkify-it'
import tlds from 'tlds'
import { last } from 'lodash'

import {
  getLastChar,
  entityTypeAt,
  getLastWord,
  getSelectionBlock
} from './utils'

let lastContentState
const linkifyIt = newLinkifyIt()
linkifyIt.tlds(tlds)

/**
 * Create link when pasted or typed into the draftjs editor
 * @param {Object} editorState - the editor state
 */
export default function createLinkEntity(editorState) {
  const currentContentState = editorState.getCurrentContent()
  const selectionState = editorState.getSelection()
  const cursorPosition = selectionState.getEndOffset()

  if (
    lastContentState === currentContentState ||
    !selectionState.isCollapsed()
  ) {
    return editorState
  }

  const currentBlock = getSelectionBlock(selectionState, currentContentState)
  const prevBlockState =
    lastContentState && getSelectionBlock(selectionState, lastContentState)
  const key = getLastChar(currentBlock, cursorPosition)

  const isNonUrlChar =
    !isValidUrlCharacter(key) &&
    prevBlockState &&
    currentBlock.getText().length === prevBlockState.getText().length + 1
  const isEnter =
    key === '' &&
    lastContentState &&
    currentContentState.getBlocksAsArray().length ===
      lastContentState.getBlocksAsArray().length + 1

  lastContentState = currentContentState

  if (!isNonUrlChar && !isEnter) {
    return editorState
  }

  // when the user enters a non url character, we detect the link just like google docs does
  const operatingSelecton = isEnter
    ? currentContentState.getSelectionBefore()
    : selectionState
  const operatingBlock = isEnter
    ? getSelectionBlock(operatingSelecton, currentContentState) // if enter pressed, operate on the previous block as enter creates a new empty block
    : currentBlock
  const operatingCursorPos = isEnter
    ? operatingBlock.getText().length // If enter pressed, consider last position of previous block
    : cursorPosition - 1
  const entityTypeAtCurrentLocation = entityTypeAt(
    operatingBlock,
    currentContentState,
    operatingCursorPos - 1 // entity is identifyable only if the cursor is before at least one character.
  )

  if (entityTypeAtCurrentLocation === 'LINK') {
    return editorState
  }

  const lastWordBeforeCursor = getLastWord(operatingBlock, operatingCursorPos)
  if (!lastWordBeforeCursor) {
    return editorState
  }

  const link = last(linkifyIt.match(lastWordBeforeCursor) || [])
  if (!link) {
    return editorState
  }

  const { index, lastIndex } = link
  const linkText = lastWordBeforeCursor.slice(index, lastIndex)

  const contentStateWithEntity = currentContentState.createEntity(
    'LINK',
    'MUTABLE',
    { url: link.url, text: null }
  )
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey()

  const lastWordStartOffset = operatingCursorPos - lastWordBeforeCursor.length

  // link character offsets in the original text block
  const linkStartOffset = lastWordStartOffset + index
  const linkEndOffset = lastWordStartOffset + lastIndex

  let linkTextSelection = operatingSelecton.merge({
    anchorOffset: linkStartOffset,
    focusOffset: linkEndOffset
  })

  const replacedContent = Modifier.replaceText(
    editorState.getCurrentContent(),
    linkTextSelection,
    linkText,
    null,
    entityKey
  )

  linkTextSelection = selectionState.merge({
    anchorOffset: cursorPosition,
    focusOffset: cursorPosition
  })

  const newEditorState = EditorState.forceSelection(
    EditorState.push(editorState, replacedContent, 'insert-link'),
    linkTextSelection
  )

  return newEditorState
}

function isValidUrlCharacter(char) {
  // Valid url characters: A-Z, a-z, 0-9,% -._~:/?#[]@!$&'()*+,;=
  // Refer: http://tools.ietf.org/html/rfc3986#section-2
  return (
    typeof char === 'string' &&
    /^[A-Za-z0-9]|[-._~:/?#[\]@!$&'()*+,;=%]$/.test(char)
  )
}
