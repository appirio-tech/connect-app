import {
  getEntityRanges,
  BLOCK_TYPE,
  ENTITY_TYPE,
  INLINE_STYLE
} from 'draft-js-utils'


const {
  BOLD,
  CODE,
  ITALIC,
  STRIKETHROUGH,
  UNDERLINE
} = INLINE_STYLE


class MarkupGenerator {
  constructor(contentState) {
    this.contentState = contentState
  }

  generate() {
    this.output = []
    this.blocks = this.contentState.getBlockMap().toArray()
    this.totalBlocks = this.blocks.length
    this.currentBlock = 0
    this.listItemCounts = {}
    while (this.currentBlock < this.totalBlocks) {
      this.processBlock()
    }
    const result = this.output.join('')
    if (result.length && result.charAt(result.length - 1) === '\n') {
      return result.slice(0, result.length - 1)
    }
    return result
  }

  processHeaderBlock(count, block) {
    this.insertLineBreak()
    this.output.push(`${'#'.repeat(count)} ${this.renderBlockContent(block)}\n`)
  }

  processBlock() {
    const block = this.blocks[this.currentBlock]
    const blockType = block.getType()
    switch (blockType) {
    case BLOCK_TYPE.HEADER_ONE: {
      this.processHeaderBlock(1, block)
      break
    }
    case BLOCK_TYPE.HEADER_TWO: {
      this.processHeaderBlock(2, block)
      break
    }
    case BLOCK_TYPE.HEADER_THREE: {
      this.processHeaderBlock(3, block)
      break
    }
    case BLOCK_TYPE.HEADER_FOUR: {
      this.processHeaderBlock(4, block)
      break
    }
    case BLOCK_TYPE.HEADER_FIVE: {
      this.processHeaderBlock(5, block)
      break
    }
    case BLOCK_TYPE.HEADER_SIX: {
      this.processHeaderBlock(6, block)
      break
    }
    case BLOCK_TYPE.UNORDERED_LIST_ITEM: {
      const blockDepth = block.getDepth()
      const lastBlock = this.getLastBlock()
      const lastBlockType = lastBlock ? lastBlock.getType() : null
      const lastBlockDepth = lastBlock && canHaveDepth(lastBlockType) ?
        lastBlock.getDepth() :
        null
      if (lastBlockType !== blockType && lastBlockDepth !== blockDepth - 1) {
        this.insertLineBreak()
        // Insert an additional line break if following opposite list type.
        if (lastBlockType === BLOCK_TYPE.ORDERED_LIST_ITEM) {
          this.insertLineBreak()
        }
      }
      const indent = ' '.repeat(block.depth * 4)
      this.output.push(
        indent + '- ' + this.renderBlockContent(block) + '\n'
      )
      break
    }
    case BLOCK_TYPE.ORDERED_LIST_ITEM: {
      const blockDepth = block.getDepth()
      const lastBlock = this.getLastBlock()
      const lastBlockType = lastBlock ? lastBlock.getType() : null
      const lastBlockDepth = lastBlock && canHaveDepth(lastBlockType) ?
        lastBlock.getDepth() :
        null
      if (lastBlockType !== blockType && lastBlockDepth !== blockDepth - 1) {
        this.insertLineBreak()
        // Insert an additional line break if following opposite list type.
        if (lastBlockType === BLOCK_TYPE.UNORDERED_LIST_ITEM) {
          this.insertLineBreak()
        }
      }
      const indent = ' '.repeat(blockDepth * 4)
      // TODO: figure out what to do with two-digit numbers
      const count = this.getListItemCount(block) % 10
      this.output.push(
        indent + `${count}. ` + this.renderBlockContent(block) + '\n'
      )
      break
    }
    case BLOCK_TYPE.BLOCKQUOTE: {
      this.insertLineBreak()
      this.output.push(' > ' + this.renderBlockContent(block) + '\n')
      break
    }
    case BLOCK_TYPE.CODE: {
      const lastBlock = this.getLastBlock()
      const lastBlockType = lastBlock ? lastBlock.getType() : null
      const nextBlock = this.getNextBlock()
      const nextBlockType = nextBlock ? nextBlock.getType() : null
      this.insertLineBreak()
      if (lastBlockType !== blockType) {
        this.output.push('```\n')
      }
      this.output.push(this.renderBlockContent(block))
      if (nextBlockType !== blockType) {
        this.output.push('\n```')
      }
      break
    }
    default: {
      this.insertLineBreak()
      this.output.push(this.renderBlockContent(block) + '\n')
      break
    }
    }
    this.currentBlock += 1
  }

  getLastBlock() {
    return this.blocks[this.currentBlock - 1]
  }

  getNextBlock() {
    return this.blocks[this.currentBlock + 1]
  }

  getListItemCount(block) {
    const blockType = block.getType()
    const blockDepth = block.getDepth()
    // To decide if we need to start over we need to backtrack (skipping list
    // items that are of greater depth)
    let index = this.currentBlock - 1
    let prevBlock = this.blocks[index]
    while (
      prevBlock &&
      canHaveDepth(prevBlock.getType()) &&
      prevBlock.getDepth() > blockDepth
    ) {
      index -= 1
      prevBlock = this.blocks[index]
    }
    if (
      !prevBlock ||
      prevBlock.getType() !== blockType ||
      prevBlock.getDepth() !== blockDepth
    ) {
      this.listItemCounts[blockDepth] = 0
    }
    return (
      this.listItemCounts[blockDepth] = this.listItemCounts[blockDepth] + 1
    )
  }

  insertLineBreak() {
    if (this.currentBlock > 0) {
      this.output.push('\n')
    }
  }

  renderBlockContent(block) {
    const blockType = block.getType()
    const text = block.getText()
    if (text === '') {
      // Prevent element collapse if completely empty.
      // TODO: Replace with constant.
      return '\u200B'
    }
    const charMetaList = block.getCharacterList()
    const entityPieces = getEntityRanges(text, charMetaList)
    return entityPieces.map(([entityKey, stylePieces]) => {
      const content = stylePieces.map(([text, style]) => {
        // Don't allow empty inline elements.
        if (!text) {
          return ''
        }
        let content = encodeContent(text)
        if (style.size === 0) {
          return content
        }
        let leadingSpaces = 0
        let trailingSpaces = 0
        if (blockType !== BLOCK_TYPE.CODE) {
          const contentTrimLeading = content.replace(/^\u0020*/, '')
          leadingSpaces = content.length - contentTrimLeading.length
          content = contentTrimLeading.replace(/\u0020*$/, '')
          trailingSpaces = contentTrimLeading.length - content.length
        }

        if (style.has(BOLD)) {
          content = `**${content}**`
        }
        if (style.has(UNDERLINE)) {
          content = `[u]${content}[/u]`
        }
        if (style.has(ITALIC)) {
          content = `_${content}_`
        }
        if (style.has(STRIKETHROUGH)) {
          // TODO: encode `~`?
          content = `~~${content}~~`
        }
        if (style.has(CODE)) {
          content = (blockType === BLOCK_TYPE.CODE) ? content : '`' + content + '`'
        }

        if (blockType !== BLOCK_TYPE.CODE) {
          content = ' '.repeat(leadingSpaces) + content + ' '.repeat(trailingSpaces)
        }
        return content
      }).join('')
      const entity = entityKey ? this.contentState.getEntity(entityKey) : null
      if (entity !== null && entity.getType().toLowerCase() === ENTITY_TYPE.LINK.toLowerCase()) {
        const data = entity.getData()
        const url = data.url || ''
        const title = data.title ? ` "${escapeTitle(data.title)}"` : ''
        return `[${content}](${encodeURL(url)}${title})`
      } else if (entity !== null && entity.getType().toLowerCase() === ENTITY_TYPE.IMAGE.toLowerCase()) {
        const data = entity.getData()
        const src = data.src || ''
        const alt = data.alt ? ` "${escapeTitle(data.alt)}"` : ''
        return `![${alt}](${encodeURL(src)})`
      } else if (entity !== null && entity.getType().toLowerCase() === 'mention') {
        const data = entity.getData()
        const url = data.mention.get('link') || ''
        const title = data.mention.get('name') ? ` "@${escapeTitle(data.mention.get('name'))}"` : ''
        return `[${content}](${encodeURL(url)}${title})`
      } else {
        return content
      }
    }).join('')
  }
}

function canHaveDepth(blockType) {
  switch (blockType) {
  case BLOCK_TYPE.UNORDERED_LIST_ITEM:
  case BLOCK_TYPE.ORDERED_LIST_ITEM:
    return true
  default:
    return false
  }
}

function encodeContent(text) {
  return text.replace(/[*_`]/g, '\\$&')
}

// Encode chars that would normally be allowed in a URL but would conflict with
// our markdown syntax: `[foo](http://foo/)`
function encodeURL(url) {
  return url.replace(/\)/g, '%29')
}

// Escape quotes using backslash.
function escapeTitle(text) {
  return text.replace(/"/g, '\\"')
}

export default function stateToMarkdown(content) {
  return new MarkupGenerator(content).generate()
}
