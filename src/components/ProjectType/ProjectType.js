import React, {PropTypes} from 'react'
import './ProjectType.scss'
import PanelProject from '../PanelProject/PanelProject'

const map = {
  IPHONE: <div key="IPHONE" className="icon icon-iphone">iPhone</div>,
  IPAD: <div key="IPAD" className="icon icon-ipad">iPad</div>,
  WEB: <div key="WEB" className="icon icon-web">Web</div>,
  APPLE_WATCH: <div key="APPLE_WATCH" className="icon icon-apple-watch"> Apple Watch</div>,
  ANDROID_WEAR: <div  key="ANDROID_WEAR" className="icon icon-android-wear">Android Wear</div>
}

const ProjectType = ({types}) => (
  <PanelProject>
    <PanelProject.Heading>
      Design &amp; Development Project
    </PanelProject.Heading>
    <div className="project-icons">
      <div className="icon-set">
        {types.slice(0, 3).map((type) => map[type])}
      </div>
      {types.length > 3 && <div className="icon-set">
        {types.slice(3).map((type) => map[type])}
      </div>}
    </div>
  </PanelProject>
)

ProjectType.propTypes = {
  types: PropTypes.arrayOf(PropTypes.oneOf(['IPHONE', 'IPAD', 'WEB', 'APPLE_WATCH', 'ANDROID_WEAR'])).isRequired
}

export default ProjectType
