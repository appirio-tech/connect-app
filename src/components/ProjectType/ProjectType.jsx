import React, {PropTypes} from 'react'
import './ProjectType.scss'
import PanelProject from '../PanelProject/PanelProject'
import TextTruncate from 'react-text-truncate'
import {Link} from 'react-router'

const deviceMap = {
  phone: <div key="IPHONE" className="icon icon-iphone">Phone</div>,
  tablet: <div key="IPAD" className="icon icon-ipad">Tablet</div>,
  desktop: <div key="WEB" className="icon icon-web">Desktop</div>,
  'apple-watch': <div key="APPLE_WATCH" className="icon icon-apple-watch"> Apple Watch</div>,
  'android-watch': <div  key="ANDROID_WEAR" className="icon icon-android-wear">Android Watch</div>
}

/*eslint-disable camelcase */
const typeMap = {
  app_dev: 'Design & Development Project',
  generic: 'Work Project',
  visual_design: 'Visual Design Project',
  visual_prototype: 'Visual Prototype Project'
}

/*eslint-enable camelcase */
const ProjectType = ({projectId, type, description, devices}) => (
  <PanelProject>
    <PanelProject.Heading>
      {typeMap[type]}
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
        <div key="GENERIC" className="icon icon-work-project">Work Project</div> }
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
