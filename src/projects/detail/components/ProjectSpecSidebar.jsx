import _ from 'lodash'
import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import update from 'react-addons-update'
import SidebarNav from './SidebarNav'
import { PROJECT_ROLE_OWNER, PROJECT_ROLE_CUSTOMER } from '../../../config/constants'
import { updateProject } from '../../actions/project'
import './ProjectSpecSidebar.scss'

const calcProgress = (project, subSection) => {
  if (subSection.id === 'questions') {
    const vals = _.map(subSection.questions, (q) => {
      const fName = q.fieldName
      // special handling for seeAttached type of fields
      if (q.type.indexOf('see-attached') > -1) {
        const val = _.get(project, fName, null)
        return val && (val.seeAttached || !_.isEmpty(_.get(project, `${fName}.value`)))
      }
      return !_.isEmpty(_.get(project, fName))
    })
    let count = 0
    _.forEach(vals, (v) => {if (v) count++ })
    return [count, subSection.questions.length]
  } else {
    // assuming there is only one question
    return [_.isEmpty(_.get(project, subSection.fieldName, null)) ? 0 : 1, 1]
  }
}

class ProjectSpecSidebar extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.onSubmitForReview = this.onSubmitForReview.bind(this)
  }

  shouldComponentUpdate(nextProps) {
    return !(
      _.isEqual(this.props.project, nextProps.project)
      && _.isEqual(this.props.currentMemberRole, nextProps.currentMemberRole)
      && _.isEqual(this.props.sections, nextProps.sections)
    )
  }

  componentWillMount() {
    this.componentWillReceiveProps(this.props)
  }

  componentWillReceiveProps(nextProps) {
    const {project, sections} = nextProps
    const navItems = _.map(sections, s => {
      return {
        name: s.title,
        required: s.required,
        link: s.id,
        subItems: _.map(s.subSections, sub => {
          return {
            name: _.isString(sub.title) ? sub.title : _.capitalize(sub.id),
            required: _.isFunction(sub.required) ? sub.required(project, s.subSections) : sub.required,
            link: `${s.id}-${sub.id}`,
            progress: calcProgress(project, sub)
          }
        })
      }
    })

    // determine if spec is complete
    let canSubmitForReview = true
    _.forEach(navItems, i => {
      _.forEach(i.subItems, s => {
        if (s.required)
          canSubmitForReview = canSubmitForReview && s.progress[0] === s.progress[1]
      })
    })
    this.setState({navItems, canSubmitForReview})
  }

  onSubmitForReview() {
    const { updateProject, project } = this.props
    updateProject(project.id, { status: 'in_review'})
  }

  render() {
    const { navItems, canSubmitForReview } = this.state
    const { currentMemberRole, project } = this.props
    const showReviewBtn = project.status === 'draft' &&
      _.indexOf([PROJECT_ROLE_OWNER, PROJECT_ROLE_CUSTOMER], currentMemberRole) > -1
    return (
      <div className="projectSpecSidebar">
        <button onClick={() => this.props.updateProject(project.id, update(project, { details: { appDefinition: { goal: { value: { $apply: (x) => { return parseInt(x) + 1}}}}}}))} className="btn btn-primary">Test Save</button>
        <h4 className="titles gray-font">Specifications</h4>
        <div className="list-group">
          <SidebarNav items={navItems} />
        </div>
        { showReviewBtn &&
        <div>
          <div className="text-box">
            <hr />
            <p>
              In order to submit your project please fill in all the required
              information. Once that you do that we&quot;ll be able to give
              you a good estimate.
            </p>
          </div>
          <div className="btn-boxs">
            <button className="tc-btn tc-btn-primary tc-btn-md"
              onClick={this.onSubmitForReview}
              disabled={!canSubmitForReview}
            >Submit for Review</button>
          </div>
        </div>
        }
      </div>
    )
  }
}

ProjectSpecSidebar.PropTypes = {
  project: PropTypes.object.isRequired,
  sections: PropTypes.arrayOf(PropTypes.object).isRequired,
  currentMemberRole: PropTypes.string
}
const mapDispatchToProps = { updateProject }

export default connect(null, mapDispatchToProps)(ProjectSpecSidebar)
