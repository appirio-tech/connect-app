import Link from './Link/Link'
import linkStrategy from './linkStrategy'

import createLinkEntity from './utils/createLink'
import handlePastedText from './utils/handlePastedText'

/**
 * Creates link plugin
 */
export default function createLinkPlugin() {
  return {
    customStyleMap: {
      LINKHIGHLIGHT: {
        background: 'rgb(0, 0, 0, 0.15)',
        color: 'black'
      }
    },
    decorators: [
      {
        strategy: linkStrategy,
        component: Link
      }
    ],
    onChange: createLinkEntity,
    handlePastedText
  }
}
