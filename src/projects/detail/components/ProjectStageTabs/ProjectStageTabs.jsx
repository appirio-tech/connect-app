import React from 'react'

import GenericMenu from '../../../../components/GenericMenu'

import './ProjectStageTabs.scss'

const ProjectStageTabs = ({
  activeTab,
  hasTimeline,
  isManageUser,
  isSuperUser,
  onTabClick,
  hasNotifications,
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

  // show specification tab for everybody expect of customers
  if (isManageUser || isSuperUser) {
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
