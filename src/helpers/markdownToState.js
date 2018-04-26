import {convertFromRaw} from 'draft-js'
const Remarkable = require('remarkable')

// Block level items, key is Remarkable's key for them, value returned is
// a function that generates the raw draftjs key and block data.
//
// Why a function? Because in some cases (headers) we need additional information
// before we can determine the exact key to return. And blocks may also return data
const DefaultBlockTypes = {
  paragraph_open: () => { //eslint-disable-line
    return {
      type: 'unstyled'
    }
  },

  blockquote_open: () => { //eslint-disable-line
    return {
      type: 'blockquote'
    }
  },

  ordered_list_item_open: () => { //eslint-disable-line
    return {
      type: 'ordered-list-item'
    }
  },

  unordered_list_item_open: () => { //eslint-disable-line
    return {
      type: 'unordered-list-item'
    }
  },

  fence: (item) => {
    if (item.content && item.content.charAt(item.content.length - 1) === '\n') {
      item.content = item.content.slice(0, item.content.length - 1)
    }
    return {
      type: 'code-block',
      text: item.content,
      entityRanges: [],
      inlineStyleRanges: []
    }
  },

  heading_open: (item) => { //eslint-disable-line
    const type = 'header-' + ({
      1: 'one',
      2: 'two',
      3: 'three',
      4: 'four',
      5: 'five',
      6: 'six'
    })[item.hLevel]

    return {
      type
    }
  }
}

// Entity types. These are things like links or images that require
// additional data and will be added to the `entityMap`
// again. In this case, key is remarkable key, value is
// meethod that returns the draftjs key + any data needed.
const DefaultBlockEntities = {
  link_open: (item) => { //eslint-disable-line

    if (item.title && item.title.startsWith('@')){
      return {
        type: 'mention',
        mutability: 'MUTABLE',
        data: {
          mention: new Map([
            ['name', item.title.slice(1)],
            ['link', item.href]
          ])
        }
      }
    }

    return {
      type: 'LINK',
      mutability: 'MUTABLE',
      data: {
        url: item.href
      }
    }
  },
  image: (item) => {
    return {
      type: 'image',
      mutability: 'IMMUTABLE',
      data: {
        alt: item.alt,
        src: item.src
      }
    }
  }
}

// Entity styles. Simple Inline styles that aren't added to entityMap
// key is remarkable key, value is draftjs raw key
const DefaultBlockStyles = {
  strong_open: 'BOLD', //eslint-disable-line
  em_open: 'ITALIC', //eslint-disable-line
  ins_open: 'UNDERLINE', //eslint-disable-line
  code: 'CODE'
}

// Key generator for entityMap items
let idCounter = -1
function generateUniqueKey() {
  idCounter++
  return idCounter
}

const IMAGE_CONTENT = ' '

/*
 * Handle inline content in a block level item
 * parses for BlockEntities (links, images) and BlockStyles (em, strong)
 * doesn't handle block level items (blockquote, ordered list, etc)
 *
 * @param <Object> inlineItem - single object from remarkable data representation of markdown
 * @param <Object> BlockEntities - key-value object of mappable block entity items. Passed in as param so users can include their own custom stuff
 * @param <Object> BlockStyles - key-value object of mappable block styles items. Passed in as param so users can include their own custom stuff
 *
 * @return <Object>
 *  content: Entire text content for the inline item,
 *  blockEntities: New block entities to be added to global block entity map
 *  blockEntityRanges: block-level representation of block entities including key to access the block entity from the global map
 *  blockInlineStyleRanges: block-level representation of styles (eg strong, em)
*/
function parseInline(inlineItem, BlockEntities, BlockStyles) {
  let content = ''
  const blockEntities = {}
  const blockEntityRanges = []
  const blockInlineStyleRanges = []
  inlineItem.children.forEach((child) => {
    if (child.type === 'text') {
      content += child.content
    } else if (child.type === 'softbreak') {
      content += '\n'
    } else if (BlockStyles[child.type]) {
      const styleBlock = {
        offset: content.length || 0,
        length: 0,
        style: BlockStyles[child.type]
      }

      // Edge case hack because code items don't have inline content or open/close, unlike everything else
      if (child.type === 'code') {
        styleBlock.length = child.content.length
        content += child.content
      }

      blockInlineStyleRanges.push(styleBlock)
    } else if (BlockEntities[child.type]) {
      const key = generateUniqueKey()

      blockEntities[key] = BlockEntities[child.type](child)

      blockEntityRanges.push({
        offset: child.type === 'image' ? 0 : content.length || 0,
        length: child.type === 'image' ? IMAGE_CONTENT.length : 0,
        key
      })
      if (child.type === 'image') {
        content = IMAGE_CONTENT
      }
    } else if (child.type.indexOf('_close') !== -1 && BlockEntities[child.type.replace('_close', '_open')]) {
      blockEntityRanges[blockEntityRanges.length - 1].length = content.length - blockEntityRanges[blockEntityRanges.length - 1].offset
    } else if (child.type.indexOf('_close') !== -1 && BlockStyles[child.type.replace('_close', '_open')]) {
      const style = BlockStyles[child.type.replace('_close', '_open')]
      let inlineStyleRange = null
      for (let i = blockInlineStyleRanges.length; i > 0; i--) {
        if (blockInlineStyleRanges[i - 1].style === style) {
          inlineStyleRange = blockInlineStyleRanges[i - 1]
          break
        }
      }
      if (inlineStyleRange) {
        inlineStyleRange.length = content.length - inlineStyleRange.offset
      }
    }
  })

  return {content, blockEntities, blockEntityRanges, blockInlineStyleRanges}
}

/**
 * Convert markdown into raw draftjs state
 *
 * @param {String} markdown - markdown to convert into raw draftjs object
 * @param {Object} options - optional additional data
 *
 * @return {Object} ContentState
**/
export function markdownToHTML(markdown) {
  const md = new Remarkable('full', {
    html: true,
    linkify: true,
    // typographer: true,
  })
  // Replace the BBCode [u][/u] to markdown '++' for underline style
  const _markdown = markdown.replace(new RegExp('\\[/?u\\]', 'g'), '++')
  return md.render(_markdown, {}) // remarkable js takes markdown and makes it an array of style objects for us to easily parse
}

/**
 * Convert markdown into raw draftjs state
 *
 * @param {String} markdown - markdown to convert into raw draftjs object
 * @param {Object} options - optional additional data
 *
 * @return {Object} ContentState
**/
function markdownToState(markdown, options = {}) {
  const md = new Remarkable('full')
  // Replace the BBCode [u][/u] to markdown '++' for underline style
  const _markdown = markdown.replace(new RegExp('\\[/?u\\]', 'g'), '++')
  // If users want to define custom remarkable plugins for custom markdown, they can be added here
  if (options.remarkablePlugins) {
    options.remarkablePlugins.forEach((plugin) => {
      md.use(plugin, {})
    })
  }

  const blocks = [] // blocks will be returned as part of the final draftjs raw object
  const entityMap = {} // entitymap will be returned as part of the final draftjs raw object
  const parsedData = md.parse(_markdown, {}) // remarkable js takes markdown and makes it an array of style objects for us to easily parse
  let currentListType = null // Because of how remarkable's data is formatted, we need to cache what kind of list we're currently dealing with

  // Allow user to define custom BlockTypes and Entities if they so wish
  const BlockTypes = Object.assign({}, DefaultBlockTypes, options.blockTypes || {})
  const BlockEntities = Object.assign({}, DefaultBlockEntities, options.blockEntities || {})
  const BlockStyles = Object.assign({}, DefaultBlockStyles, options.blockStyles || {})

  parsedData.forEach((item) => {

    if (item.type === 'bullet_list_open') {
      currentListType = 'unordered_list_item_open'
    } else if (item.type === 'ordered_list_open') {
      currentListType = 'ordered_list_item_open'
    }

    let itemType = item.type
    if (itemType === 'list_item_open') {
      itemType = currentListType
    }

    if (itemType === 'inline') {
      // Parse inline content and apply it to the most recently created block level item,
      // which is where the inline content will belong.
      const {content, blockEntities, blockEntityRanges, blockInlineStyleRanges} = parseInline(item, BlockEntities, BlockStyles)
      const blockToModify = blocks[blocks.length - 1]
      blockToModify.text = content
      blockToModify.inlineStyleRanges = blockInlineStyleRanges
      blockToModify.entityRanges = blockEntityRanges
      if (content === IMAGE_CONTENT && blockEntityRanges.length && blockEntities[blockEntityRanges[0].key].type === 'image') {
        blockToModify.type = 'atomic'
      }
      // The entity map is a master object separate from the block so just add any entities created for this block to the master object
      Object.assign(entityMap, blockEntities)
    } else if ((itemType.indexOf('_open') !== -1 || itemType === 'fence') && BlockTypes[itemType]) {
      // Draftjs only supports 1 level of blocks, hence the item.level === 0 check below
      // List items will always be at least `level==1` though so we need a separate check fo that
      // TODO: Draft does allow lists to be nested within lists, it's the one exception to its rule,
      // but right now this code doesn't support that.
      if (item.level === 0 || item.type === 'list_item_open') {
        const block = Object.assign({
          depth: 0
        }, BlockTypes[itemType](item))

        blocks.push(block)
      }
    }
  })

  return convertFromRaw({
    entityMap,
    blocks
  })
}

export default markdownToState
