import React from 'react'

import GenericMenu from '../../../../components/GenericMenu'

import './ProjectStageTabs.scss'

const ProjectStageTabs = ({
  activeTab,
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
    }/* , // hide it for now, see https://github.com/appirio-tech/connect-app/issues/2276
    {
      onClick: () => onTabClick('specification'),
      label: 'Specification',
      isActive: activeTab === 'specification'
    } */
  ]

  return (
    <div styleName="container">
      <GenericMenu navLinks={tabs} />
    </div>
  )
}

export default ProjectStageTabs
