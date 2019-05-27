import { last } from 'lodash'
import { EditorState, Modifier, SelectionState, RichUtils } from 'draft-js'

/**
 * Get the block corresponding to the selection state
 * @param {Object} selectionState - the selection state
 * @param {Object} contentState the contentState
 * @param {boolean} useFocusKey - true means, focus key is used to get the block instead of anchor key
 */
export function getSelectionBlock(selectionState, contentState, useFocusKey) {
  const key = useFocusKey
    ? selectionState.getFocusKey()
    : selectionState.getAnchorKey()
  const currentBlock = contentState.getBlockForKey(key)
  return currentBlock
}

/**
 * Gets the type of the Entity at given cursor position
 * @param {Object} currentBlock - the current block
 * @param {Object} contentState - the content state
 * @param {number} cursorPosition - the cursor offset in current block
 */
export function entityTypeAt(currentBlock, contentState, cursorPosition) {
  const entityAtCurrentLocation = getEntityAt(
    currentBlock,
    contentState,
    cursorPosition
  )
  return entityAtCurrentLocation && entityAtCurrentLocation.getType()
}

/**
 * Gets the last word from the given cursor position
 * @param {Object} currentBlock - the current block
 * @param {number} cursorPosition - the cursor offset in current block
 */
export function getLastWord(currentBlock, cursorPosition) {
  const currentBlockText = currentBlock.getText()
  const lastWord = last(currentBlockText.slice(0, cursorPosition).split(' '))
  return lastWord
}

/**
 * Get the last character from the given cursor position
 * @param {Object} currentBlock - the current block
 * @param {number} cursorPosition - the cursor offset in current block
 */
export function getLastChar(currentBlock, cursorPosition) {
  const currentBlockText = currentBlock.getText()
  const lastChar = currentBlockText.slice(cursorPosition - 1, cursorPosition)
  return lastChar
}

/**
 * Get Entity at the given cursor position
 * @param {Object} currentBlock - the current block
 * @param {Object} contentState - the current contentstate
 * @param {number} cursorPosition - the cursorPosition in the block
 */
export function getEntityAt(currentBlock, contentState, cursorPosition) {
  const entityKeyAtCurrentLocation = currentBlock.getEntityAt(cursorPosition)
  const entityAtCurrentLocation = getEntityForKey(
    contentState,
    entityKeyAtCurrentLocation
  )
  return entityAtCurrentLocation
}

/**
 * Gets the entity for the given key
 * @param {Object} contentState The content state of the editor
 * @param {string} entityKey The key of the target entity
 */
export function getEntityForKey(contentState, entityKey) {
  try {
    return entityKey && contentState.getEntity(entityKey)
  } catch (ex) {
    return null
  }
}

/**
 * Get the offsets of entityrange in the given block
 * @param {Object} currentBlock - the current block
 * @param {string} {entityKey} - the entitykey
 */
export function getEntityOffsets(currentBlock, entityKey) {
  let offsets
  currentBlock.findEntityRanges(
    character => character.getEntity() === entityKey,
    (start, end) => {
      offsets = [start, end]
    }
  )
  return offsets
}

/**
 * Get the block corresponding to the target entity
 * @param {Object} contentState The state of the content of the editor
 * @param {string} entityKey The key of the target entity
 */
export function getEntityBlock(contentState, entityKey) {
  const blocks = contentState.getBlocksAsArray()
  let block

  for (let i = 0; i < blocks.length; i++) {
    block = getEntityOffsets(blocks[i],  entityKey ) ? blocks[i] : null
    if (block) {
      break
    }
  }

  return block
}

/**
 * Updates the given entity data and updates the decorated text
 * @param {Object} editorState - the editor statae
 * @param {Object} contentState - the content state of the editor
 * @param {string} entityKey - the entity key
 * @param {Object} data - the entity data
 */
export function updateLink(editorState, contentState, entityKey, data) {
  let selectionState = editorState.getSelection()

  const startBlock = getSelectionBlock(selectionState, contentState)
  let offsetKey = startBlock.getKey()
  let offsets = getEntityOffsets(startBlock, entityKey )
  let entityBlock = startBlock

  if (!offsets) {
    entityBlock = getEntityBlock(contentState, entityKey)
    offsets = getEntityOffsets(entityBlock,  entityKey )
    offsetKey = entityBlock.getKey()
  }

  const [startOffset, endOffset] = offsets
  const currentDecoratedText = entityBlock
    .getText()
    .slice(startOffset, endOffset)
  const currentEntity = getEntityForKey(contentState, entityKey)
  const currentEntityData = currentEntity && currentEntity.getData()

  let decoratedText = data.text || currentDecoratedText

  // text is intentionally removed. Now, consider url for displaying
  if (currentEntityData && currentEntityData.text && !data.text) {
    decoratedText = data.url
  }

  contentState.mergeEntityData(entityKey, data)

  selectionState = SelectionState.createEmpty(offsetKey).merge({
    anchorOffset: startOffset,
    focusOffset: endOffset
  })

  const replacedContent = Modifier.replaceText(
    contentState,
    selectionState,
    decoratedText,
    null,
    entityKey
  )

  return EditorState.push(editorState, replacedContent, 'update-link')
}

/**
 * Applies a url on a multi line selection
 * @param {Object} editorState The editor state
 * @param {Object} entityData the data associated with the link entity
 * @param {Object[]} entities The list of entity objects
 * @param {Object[]} selections The list of editor selections
 */
export function updateMultilineLink(
  editorState,
  entityData,
  entities,
  selections
) {
  let contentState = editorState.getCurrentContent()
  selections.forEach((selection, i) => {
    const oldEntityData = entities[i].getData()
    const contentStateWithEntity = contentState.createEntity(
      'LINK',
      'MUTABLE',
      { url: entityData.url, text: oldEntityData.text }
    )
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey()

    contentState = Modifier.replaceText(
      contentState,
      selection,
      oldEntityData.text,
      null,
      entityKey
    )
  })

  return EditorState.push(
    editorState,
    contentState,
    'apply-entity'
  )
}

/**
 * Removes the link from current cursor position
 * @param {Object} editorState the editor state
 * @param {string} entityKey the entity key
 */
export function removeLink(editorState, entityKey) {
  const contentState = editorState.getCurrentContent()
  let selectionState = editorState.getSelection()
  const initialSelection = selectionState

  const startBlock = getSelectionBlock(selectionState, contentState)
  let offsets = getEntityOffsets(startBlock,  entityKey )

  let offsetKey = startBlock.getKey()

  // Entity not found in current block.
  // This happens when you move around with arrow keys or enter key while autopopover is on.
  if (!offsets) {
    const entityBlock = getEntityBlock(contentState, entityKey)
    offsets = getEntityOffsets(entityBlock,  entityKey )
    offsetKey = entityBlock.getKey()
  }

  const [startOffset, endOffset] = offsets

  selectionState = selectionState.merge({
    anchorOffset: startOffset,
    focusOffset: endOffset,
    anchorKey: offsetKey,
    focusKey: offsetKey,
    isBackward: false
  })

  const replacedContent = Modifier.applyEntity(
    contentState,
    selectionState,
    null
  )

  return EditorState.forceSelection(
    EditorState.push(editorState, replacedContent, 'update-link'),
    initialSelection
  )
}

/**
 * Applies link entity to the selection
 * @param {Object} editorState - the editor state
 * @param {Object} contentState - the editor state
 * @param {Object} selectionState - the selection state
 */
export function applyLink(editorState, contentState, selectionState) {
  const selectionStart = selectionState.getStartOffset()
  const selectionEnd = selectionState.getEndOffset()
  const startBlock = getSelectionBlock(selectionState, contentState)

  const contentStateWithEntity = contentState.createEntity('LINK', 'MUTABLE', {
    text: startBlock.getText().slice(selectionStart, selectionEnd)
  })
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey()

  const newContentState = Modifier.applyEntity(
    contentState,
    selectionState,
    entityKey
  )

  const updatedState = EditorState.push(
    editorState,
    newContentState,
    'apply-entity'
  )

  return { updatedState, entityKey, contentStateWithEntity, newContentState }
}

/**
 * Apply placeholder links for a multi line selection
 * @param {Object} editorState The editor state
 * @param {Object} contentState The content state of the editor
 * @param {Object} selectionState The selection state of the editor
 */
export function applyMultiLineLink(editorState, contentState, selectionState) {
  const startKey = selectionState.getStartKey()
  const endKey = selectionState.getEndKey()

  const startOffset = selectionState.getStartOffset()
  const endOffset = selectionState.getEndOffset()

  const entityKeys = []
  const selectionStates = []

  const startBlock = contentState.getBlockForKey(startKey)
  let _selectionState = SelectionState.createEmpty(startKey).merge({
    anchorOffset: startOffset,
    focusOffset: startBlock.getLength()
  })

  let key = startKey
  let { updatedState: state, entityKey, newContentState } = applyLink(
    editorState,
    contentState,
    _selectionState
  )
  entityKeys.push(entityKey)
  selectionStates.push(_selectionState)
  do {
    key = newContentState.getKeyAfter(key)
    const block = newContentState.getBlockForKey(key)
    _selectionState = SelectionState.createEmpty(key).merge({
      anchorOffset: 0,
      focusOffset: key === endKey ? endOffset : block.getLength()
    })
    ;({ updatedState: state, entityKey, newContentState } = applyLink(
      state,
      newContentState,
      _selectionState
    ))
    entityKeys.push(entityKey)
    selectionStates.push(_selectionState)
  } while (key !== endKey)
  return {
    updatedState: state,
    entityKeys,
    contentStateWithEntity: state.getCurrentContent(),
    selectionStates
  }
}

/**
 * Inserts link entity at the given cursor position
 * @param {Object} editorState - the editor state
 * @param {Object} contentState - the content state
 * @param {Object} selectionState - the selection state
 */
export function insertLink(editorState, contentState, selectionState) {
  const placeholderText = ' '
  const contentStateWithEntity = contentState.createEntity('LINK', 'MUTABLE', {
    text: ''
  })
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey()

  const selectionStart = selectionState.getStartOffset()
  const selectionEnd = selectionState.getEndOffset()

  const newContentState = Modifier.insertText(
    contentState,
    selectionState,
    placeholderText,
    null,
    entityKey
  )

  const updatedState = EditorState.forceSelection(
    EditorState.push(editorState, newContentState, 'insert-link'),

    selectionState.merge({
      anchorOffset: selectionStart,
      focusOffset: selectionEnd + 1, // replace placeholder space when applied
      isBackward: false
    })
  )

  return { updatedState, entityKey, contentStateWithEntity }
}

/**
 * Removes all link editing highlights from the editor
 * @param {Object} editorState The current editor state
 */
export function removeHighlight(editorState) {
  const contentState = editorState.getCurrentContent()
  const blocks = contentState.getBlocksAsArray()
  const initialSelection = editorState.getSelection()

  const highlightStyleName = 'LINKHIGHLIGHT'
  let removedHighlights = false
  blocks.forEach(block => {
    block.findStyleRanges(
      char => char.hasStyle(highlightStyleName),
      (start, end) => {
        removedHighlights = true
        const selection = SelectionState.createEmpty(block.key).merge({
          anchorOffset: start,
          focusOffset: end
        })

        editorState = EditorState.forceSelection(editorState, selection)
        editorState = RichUtils.toggleInlineStyle(
          editorState,
          highlightStyleName
        )
      }
    )
  })

  return removedHighlights
    ? EditorState.push(
      EditorState.forceSelection(editorState, initialSelection),
      editorState.getCurrentContent(),
      'change-inline-style'
    )
    : null
}
