import React from 'react'
import Handlebars from 'handlebars'

import './StaticSection.scss'

const StaticSection = ({ content, currentProjectData }) => {
  const tmpl = Handlebars.compile(content)
  const processedContent = tmpl(currentProjectData)
  
  return <div styleName="static-section" dangerouslySetInnerHTML={{__html: processedContent}} />
}

export default StaticSection