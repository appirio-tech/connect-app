import React from 'react'

import GenericMenu from '../../../../components/GenericMenu'

import './ProjectStageTabs.scss'

const ProjectStageTabs = ({
  activeTab,
  hasTimeline,
  onTabClick,
  hasNotifications,
  hideSpecTab,
}) => {
  const tabs = []

  if (hasTimeline) {
    tabs.push({
      onClick: () => onTabClick('timeline'),
      label: 'Timeline',
      isActive: activeTab === 'timeline',
      hasNotifications: hasNotifications.timeline,
    })
  }

  tabs.push({
    onClick: () => onTabClick('posts'),
    label: 'Discussions',
    isActive: activeTab === 'posts',
    hasNotifications: hasNotifications.posts,
  })

  // hide specification tab if customers or generic phase
  if (!hideSpecTab) {
    tabs.push({
      onClick: () => onTabClick('specification'),
      label: 'Specification',
      isActive: activeTab === 'specification',
      hasNotifications: hasNotifications.specification,
    })
  }

  return (
    <div styleName="container">
      <GenericMenu navLinks={tabs} />
    </div>
  )
}

export default ProjectStageTabs
