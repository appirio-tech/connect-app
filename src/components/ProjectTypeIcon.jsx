/**
 * ProjectTypeIcon component
 *
 * Renders proper project type icon depend on the project type
 */
import React from 'react'
import PT from 'prop-types'

import IconProjectTypeSolutions from '../assets/icons/v.2.5/project-type-solutions.svg'
import IconProjectTypeTalentAsService from '../assets/icons/v.2.5/project-type-talent-as-a-service.svg'
import IconProjectDefault from '../assets/icons/v.2.5/project-default.svg'

const ProjectTypeIcon = ({ type }) => {
  // if type is defined as a relative path to the icon, convert it to icon "id"
  const typeAsPath = type && type.match(/(?:\.\.\/)+assets\/icons\/([^.]+)\.svg/)
  if (typeAsPath) {
    type = typeAsPath[1]
  }

  switch(type){
  case 'project-type-solutions': 
    return <IconProjectTypeSolutions />
  case 'project-type-talent-as-a-service':
    return <IconProjectTypeTalentAsService />
  default:
    // this will be default icon
    return <IconProjectDefault />
  }
}

ProjectTypeIcon.propTypes = {
  type: PT.string,
}

export default ProjectTypeIcon
