/**
 * Wrapper around Feed component
 *
 * It renders desktop/mobile versions of the Feed and adds support for scrolling
 */
import React from 'react'

import MediaQuery from 'react-responsive'
import { ScrollElement } from 'react-scroll'
import Feed from '../../../components/Feed/Feed'
import FeedMobile from '../../../components/Feed/FeedMobile'

import { SCREEN_BREAKPOINT_MD } from '../../../config/constants'

const ScrollableFeedDesktop = ScrollElement(Feed) // eslint-disable-line new-cap
const ScrollableFeedMobile = ScrollElement(FeedMobile) // eslint-disable-line new-cap

const ScrollableFeed = (props) => (
  <MediaQuery minWidth={SCREEN_BREAKPOINT_MD}>
    {(matches) => (matches ?
      (
        <ScrollableFeedDesktop {...props}>
          {props.sendForReview && <div className="panel-buttons">
            <button className="tc-btn tc-btn-primary tc-btn-md">Send for review</button>
          </div>}
        </ScrollableFeedDesktop>
      ) : (
        <ScrollableFeedMobile {...props}>
          {props.sendForReview && <div className="panel-buttons">
            <button className="tc-btn tc-btn-primary tc-btn-md">Send for review</button>
          </div>}
        </ScrollableFeedMobile>
      )
    )}
  </MediaQuery>
)

export default ScrollableFeed
