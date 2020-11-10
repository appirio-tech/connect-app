import React from 'react'

import Drawer from 'appirio-tech-react-components/components/Drawer/Drawer'

import FeedContainer from '../../projects/detail/containers/FeedContainer'

import './TopicDrawer.scss'

/**
 * A drawer that shows the posts under the selected topic
 */
const TopicDrawer = ({
  open,
  onClose,
  project,
  topic
}) => {
  return (
    <Drawer
      open={open}
      styleName="drawer-container"
      containerStyle={{
        top: '60px',
        height: 'calc(100% - 60px)',
        display: 'flex',
        flexDirection: 'column'
      }}
      overlayStyle={{ top: '60px', left: '280px' }}
      onRequestChange={open => !open && onClose()}
    >
      {open && (
        <FeedContainer
          project={project}
          topics={[topic]}
          inTopicDrawer
          onDrawerClose={onClose}
        />
      )}
    </Drawer>
  )
}

export default TopicDrawer
