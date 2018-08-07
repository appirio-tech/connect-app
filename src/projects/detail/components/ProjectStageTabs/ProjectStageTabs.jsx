import React from 'react'

import GenericMenu from '../../../../components/GenericMenu'

import './ProjectStageTabs.scss'

const ProjectStageTabs = ({
  activeTab,
  isManageUser,
  isSuperUser,
  onTabClick,
}) => {
  const tabs = [
    {
      onClick: () => onTabClick('timeline'),
      label: 'Timeline',
      isActive: activeTab === 'timeline'
    },
    {
      onClick: () => onTabClick('posts'),
      label: 'Posts',
      isActive: activeTab === 'posts'
    },
  ]

  // show specification tab for everybody expect of customers
  if (isManageUser || isSuperUser) {
    tabs.push({
      onClick: () => onTabClick('specification'),
      label: 'Specification',
      isActive: activeTab === 'specification'
    })
  }

  return (
    <div styleName="container">
      <GenericMenu navLinks={tabs} />
    </div>
  )
}

export default ProjectStageTabs
