import { values } from 'lodash'
import markdownToState from './markdownToState'

export function hasEntity (entityType, editorState) {
  const entity = getCurrentEntity(editorState)
  if (entity && entity.getType() === entityType) {
    return true
  }
  return false
}

export function getCurrentEntityKey (editorState) {
  const selection = editorState.getSelection()
  const anchorKey = selection.getAnchorKey()
  const contentState = editorState.getCurrentContent()
  const anchorBlock = contentState.getBlockForKey(anchorKey)
  const offset = selection.anchorOffset
  const index = selection.isBackward ? offset - 1 : offset
  return anchorBlock.getEntityAt(index)
}

export function getCurrentEntity (editorState) {
  const entityKey = getCurrentEntityKey(editorState)
  if (entityKey) {
    return editorState.getCurrentContent().getEntity(entityKey)
  }
  return null
}

export function getLinksFromPost(postContent) {
  const contentState = markdownToState(postContent)
  const entities = values(contentState.entityMap)

  const linkEntities = entities
    .map(e => contentState.getEntity(e))
    .filter(e => e.type === 'LINK').map(e => e.data)

  return linkEntities
}