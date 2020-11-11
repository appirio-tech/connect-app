import React from 'react'

import GenericMenu from '../../../../components/GenericMenu'
import { PERMISSIONS } from '../../../../config/permissions'
import { hasPermission } from '../../../../helpers/permissions'

import './ProjectStageTabs.scss'

const ProjectStageTabs = ({
  activeTab,
  hasTimeline,
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
  if (hasPermission(PERMISSIONS.MANAGE_PROJECT_PLAN)) {
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
