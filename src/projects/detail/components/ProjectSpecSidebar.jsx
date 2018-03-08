import _ from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import SidebarNav from './SidebarNav'
import VisualDesignProjectEstimateSection from './VisualDesignProjectEstimateSection'
import { PROJECT_ROLE_OWNER, PROJECT_ROLE_CUSTOMER } from '../../../config/constants'
import { updateProject } from '../../actions/project'
import './ProjectSpecSidebar.scss'

const calcProgress = (project, subSection) => {
  if (subSection.type === 'questions') {
    const vals = _.map(subSection.questions, (q) => {
      const fName = q.fieldName
      // special handling for seeAttached type of fields
      if (q.type.indexOf('see-attached') > -1) {
        const val = _.get(project, fName, null)
        return val && (val.seeAttached || !_.isEmpty(_.get(project, `${fName}.value`)))
      } else if (q.type === 'checkbox-group'){
        return _.get(project, q.fieldName, []).length
      }
      return !_.isEmpty(_.get(project, fName))
    })
    let count = 0
    _.forEach(vals, (v) => {if (v) count++ })
    // Github issue#1399, filtered only required questions to set expected length of valid answers
    const filterRequiredQuestions = (q) => (
      // if required attribute is missing on question, but sub section has required flag, assume question as required
      // or question should have required flag or validation isRequired
      (typeof q.required === 'undefined' && subSection.required)
      || q.required
      || (q.validations && q.validations.indexOf('isRequired') !== -1)
    )
    return [count, _.filter(subSection.questions, filterRequiredQuestions).length]
  } else if (subSection.id === 'screens') {
    const screens = _.get(project, 'details.appScreens.screens', [])
    const validScreens = screens.filter((s) => {
      const vals = _.filter(subSection.questions, (q) => {
        const fName = q.fieldName
        return !_.isEmpty(_.get(s, fName))
      })
      return vals.length === subSection.questions.filter((q) => q.required).length
    })
    return [validScreens.length, screens.length]//TODO we should do range comparison here
  } else {
    // assuming there is only one question
    let val = _.get(project, subSection.fieldName, null)
    if (val && typeof val.trim === 'function') {
      val = val.trim()
    }
    return [_.isEmpty(val) ? 0 : 1, 1]
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
        name: typeof s.title === 'function' ? s.title(project, false): s.title,
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
    updateProject(project.id, { status: 'in_review'}).then(() => {
      this.props.history.push(`/projects/${project.id}`)
    })
  }

  render() {
    const { navItems, canSubmitForReview } = this.state
    const { currentMemberRole, project } = this.props
    const showReviewBtn = project.status === 'draft' &&
      _.indexOf([PROJECT_ROLE_OWNER, PROJECT_ROLE_CUSTOMER], currentMemberRole) > -1

    // NOTE: May be beneficial to refactor all of these logics into a higher-order
    // component that returns different project estimate components for different
    // types of projects in the future. But let's keep it this way for now because
    // project estimate is only available for one kind of projects
    const getProjectEstimateSection = () => {
      const { products } = project.details

      return (
        <div className="list-group">
          <VisualDesignProjectEstimateSection products={products} project={project} />
        </div>
      )
    }

    return (
      <div className="projectSpecSidebar">
        <h4 className="titles gray-font">Specifications</h4>
        <div className="list-group">
          <SidebarNav items={navItems} />
        </div>

        <br/>

        {getProjectEstimateSection()}

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

export default withRouter(connect(null, mapDispatchToProps)(ProjectSpecSidebar))
