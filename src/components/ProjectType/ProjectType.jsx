import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import './ProjectType.scss'
import PanelProject from '../PanelProject/PanelProject'
import TextTruncate from 'react-text-truncate'
import { findCategory } from '../../config/projectWizard'
import {Link} from 'react-router-dom'
import WorkProject from '../../assets/icons/tech-32px-outline-work-project.svg'

const deviceMap = {
  phone: <div key="IPHONE">Phone</div>,
  tablet: <div key="IPAD">Tablet</div>,
  desktop: <div key="WEB">Desktop</div>,
  wearable: <div key="APPLE_WATCH">Apple Watch</div>,
  'apple-watch': <div key="APPLE_WATCH">Apple Watch</div>,
  'android-watch': <div  key="ANDROID_WEAR">Android Watch</div>
}


/*eslint-enable camelcase */
const ProjectType = ({projectId, type, description, devices}) => (
  <PanelProject>
    <PanelProject.Heading>
      { _.get(findCategory(type), 'name', '') }
    </PanelProject.Heading>
    <TextTruncate
      containerClassName="project-description"
      line={4}
      truncateText="..."
      text={ description }
      textTruncateChild={<Link className="read-more-link" to={`/projects/${projectId}/specification`}>read more &gt;</Link>}
    />

    <div className="project-icons">
      {type === 'generic' &&
        <div key="GENERIC">
          <WorkProject className="icon icon-work-project" />
          Work Project
        </div>}
      {type !== 'generic' &&
        <div className="icon-set">
          {devices.slice(0, 3).map((device) => deviceMap[device])}
        </div>}
        {type !== 'generic' && devices.length > 3 && <div className="icon-set">
          {devices.slice(3).map((device) => deviceMap[device])}
        </div>}
    </div>

  </PanelProject>
)

ProjectType.propTypes = {
  type: PropTypes.string.isRequired,
  devices: PropTypes.arrayOf(PropTypes.oneOf(['generic', 'phone', 'tablet', 'desktop', 'apple-watch', 'android-watch'])).isRequired
}

ProjectType.defaultProps = {
  devices: []
}

export default ProjectType
