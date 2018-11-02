/**
 * Feed with support of scrolling
 */
import { ScrollElement } from 'react-scroll'
import Feed from './Feed'

const ScrollableFeed = ScrollElement(Feed) // eslint-disable-line new-cap

export default ScrollableFeed
