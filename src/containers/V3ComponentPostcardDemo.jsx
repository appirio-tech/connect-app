import React from 'react'
import V3Template from './V3Template'
import PostCard from '../components/v3/PostCard'
import PostFeed from '../components/v3/PostFeed'
import './V3ComponentDemo.scss'

class V3ComponentPostcardDemo extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div styleName="v3-component-demolist">
        <V3Template>
          <div styleName="viewport">

            <h2 styleName="group-title">PostCard and PostFeed</h2>

            <h3>PostFeed</h3>
            <PostFeed 
              thumb="../../../assets/images/hero-tc-landing.png"
              postTitle="C English"
              timeStamp="3:03 pm"
              postContent="Done, Luis! Thank you! I’m hoping we can still do the mini-demo for next week (starts Monday in Doha)? If so, I will try to select the slides (20?) once the tweaks have been made?"
            />

            <h3>PostCard</h3>
            <PostCard />
          </div>
        </V3Template>
      </div>
    )
  }
}

export default V3ComponentPostcardDemo