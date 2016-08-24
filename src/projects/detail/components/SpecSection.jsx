import React, { PropTypes } from 'react'
import { Tabs, Tab, TCFormFields } from 'appirio-tech-react-components'
import _ from 'lodash'
import SpecQuestions from './SpecQuestions'
import FeatureList from '../../../components/FeatureList/FeatureList'
import FileListContainer from './FileListContainer'


const SpecSection = props => {
  const {project, showFeaturesDialog, id, title, description, subSections} = props
  const renderSubSection = (subSection, idx) => (
    <div key={idx} className="section-features-module" id={[id, subSection.id].join('-')}>
      <div className="bottom-border-titles">
        <h4 className="title">{typeof subSection.title === 'function' ? subSection.title(project): subSection.title }</h4>
        { subSection.type === 'features' &&
          <div className="section-actions">
            <button href="javascript:"  onClick={ showFeaturesDialog } className="tc-btn-default tc-btn-sm">Add / Edit features</button>
          </div>
        }
      </div>
      <div className="content-boxs">
        {renderChild(subSection)}
      </div>
    </div>
  )

  const renderChild = props => {
    const {type} = props

    switch(type) {
    case 'tabs': {
      const tabs = _.get(props, 'tabs')
      const renderTab = (t, idx) => (
        <Tab key={idx+1} eventKey={idx+1} title={t.title}>
          {renderChild(t)}
        </Tab>
      )
      return (
        <Tabs defaultActiveKey={1}>
          {tabs.map(renderTab)}
        </Tabs>
      )
    }
    case 'features':
      return (
        <FeatureList>
          {_.get(project, props.fieldName, []).map(
            (f, idx) => <FeatureList.Item {...f} key={idx} />
          )}
        </FeatureList>
      )
    case 'questions':
      return (
        <SpecQuestions questions={props.questions} />
      )
    case 'notes':
      return (
        <TCFormFields.Textarea
          name={props.fieldName}
          label={props.description}
          wrapperClass="row"
        />
      )
    case 'files': {
      const files = _.get(project, props.fieldName, [])
      return <FileListContainer projectId={project.id} files={files} />
    }
    default:
      return <noscript />
    }
  }

  return (
    <div className="right-area-item" id={id}>
      <div className="boxes">
        <h2 className="big-titles" id={id}>{title}</h2>
          <p className="gray-text">
            {description}
          </p>
          {subSections.map(renderSubSection)}
          <div className="button-area">
            <button className="tc-btn tc-btn-primary tc-btn-md" type="submit">Save Changes</button>
          </div>
        </div>
    </div>
  )
}

SpecSection.propTypes = {
  project: PropTypes.object.isRequired
}

export default SpecSection

/*

<div className="section-features-module" id="design-spec-features">
  <div className="bottom-border-titles">
    <h4 className="title">What are the major features of your app?</h4>
    <div className="section-actions">
      <button href="javascript:;"  onClick={ this.showFeaturesDialog } className="tc-btn-default tc-btn-sm">Add / Edit features</button>
    </div>
  </div>
  <div className="content-boxs">
    <div className="tabs">
      <ul>
        <li><a href="#">Define my app</a></li>
        <li className="active"><a href="#">Upload a speck document</a></li>
      </ul>
    </div>
    <div className="contents-list part-one">
      <div className="item dashed-bottom-border clearfix">
        <i className="icons icon-box"></i>
        <div className="right-area">
          <h4 className="title">Search</h4>
          <p className="txt">Allow users to register and log in using third-party services such as Facebook, Twitter.</p>
        </div>
      </div>
      <div className="item dashed-bottom-border  clearfix">
        <i className="icons icon-box"></i>
        <div className="right-area">
          <h4 className="title">Geolocation feature</h4>
          <p className="txt">
            Add this feature if your app has any geographic location-based functionality, such as showing
            store locations on a map or illustrating the progress of a delivery. Please specify your desired functionality below.
          </p>
        </div>
      </div>
      <div className="item dashed-bottom-border  clearfix">
        <i className="icons icon-magic"></i>
        <div className="right-area">
          <h4 className="title">Slack bot integration</h4>
          <p className="txt">
            My app needs to be able to connect ot Slack and transmit all data of people using it in real time,
            so we can follow up with them almost instantly.
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
 */
