import React from 'react'

import Drawer from 'appirio-tech-react-components/components/Drawer/Drawer'

import FeedContainer from '../../projects/detail/containers/FeedContainer'

/**
 * A drawer that shows the posts under the selected topic
 */
const TopicDrawer = ({
  open,
  onClose,
  currentMemberRole,
  isSuperUser,
  project,
  topic
}) => {
  return (
    <Drawer
      open={open}
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
          currentMemberRole={currentMemberRole}
          project={project}
          isSuperUser={isSuperUser}
          topics={[topic]}
          inTopicDrawer
          onDrawerClose={onClose}
        />
      )}
    </Drawer>
  )
}

export default TopicDrawer
