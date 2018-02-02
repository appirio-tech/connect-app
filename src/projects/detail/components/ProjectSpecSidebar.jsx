import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'
import isString from 'lodash/isString'
import capitalize from 'lodash/capitalize'
import isFunction from 'lodash/isFunction'
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
    const vals = subSection.questions.map((q) => {
      const fName = q.fieldName
      // special handling for seeAttached type of fields
      if (q.type.indexOf('see-attached') > -1) {
        const val = get(project, fName, null)
        return val && (val.seeAttached || !isEmpty(get(project, `${fName}.value`)))
      }
      return !isEmpty(get(project, fName))
    })
    let count = 0
    vals.forEach((v) => {if (v) count++ })
    // Github issue#1399, filtered only required questions to set expected length of valid answers
    const filterRequiredQuestions = (q) => (
      // if required attribute is missing on question, but sub section has required flag, assume question as required
      // or question should have required flag or validation isRequired
      (typeof q.required === 'undefined' && subSection.required)
      || q.required
      || (q.validations && q.validations.indexOf('isRequired') !== -1)
    )
    return [count, subSection.questions.filter(filterRequiredQuestions).length]
  } else if (subSection.id === 'screens') {
    const screens = get(project, 'details.appScreens.screens', [])
    const validScreens = screens.filter((s) => {
      const vals = subSection.questions.filter((q) => {
        const fName = q.fieldName
        return !isEmpty(get(s, fName))
      })
      return vals.length === subSection.questions.filter((q) => q.required).length
    })
    return [validScreens.length, screens.length]//TODO we should do range comparison here
  } else {
    // assuming there is only one question
    let val = get(project, subSection.fieldName, null)
    if (val && typeof val.trim === 'function') {
      val = val.trim()
    }
    return [isEmpty(val) ? 0 : 1, 1]
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
      isEqual(this.props.project, nextProps.project)
      && isEqual(this.props.currentMemberRole, nextProps.currentMemberRole)
      && isEqual(this.props.sections, nextProps.sections)
    )
  }

  componentWillMount() {
    this.componentWillReceiveProps(this.props)
  }

  componentWillReceiveProps(nextProps) {
    const {project, sections} = nextProps
    const navItems = sections.map(s => {
      return {
        name: typeof s.title === 'function' ? s.title(project, false): s.title,
        required: s.required,
        link: s.id,
        subItems: s.subSections.map(sub => {
          return {
            name: isString(sub.title) ? sub.title : capitalize(sub.id),
            required: isFunction(sub.required) ? sub.required(project, s.subSections) : sub.required,
            link: `${s.id}-${sub.id}`,
            progress: calcProgress(project, sub)
          }
        })
      }
    })

    // determine if spec is complete
    let canSubmitForReview = true
    navItems.forEach(i => {
      i.subItems.forEach(s => {
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
      [PROJECT_ROLE_OWNER, PROJECT_ROLE_CUSTOMER].indexOf(currentMemberRole) > -1

    // NOTE: May be beneficial to refactor all of these logics into a higher-order
    // component that returns different project estimate components for different
    // types of projects in the future. But let's keep it this way for now because
    // project estimate is only available for one kind of projects
    const getProjectEstimateSection = () => {
      const { appDefinition, products } = project.details

      // project estimate only available for visual design porjects right now
      // estimation is support with introduction of products, hence it would rendered only for new projects
      if (project.type !== 'visual_design' || !products || project.details.products[0] === 'generic_design') return

      if (!appDefinition || !appDefinition.numberScreens) return (
        <div className="list-group"><VisualDesignProjectEstimateSection  products={products} /></div>
      )

      return (
        <div className="list-group">
          <VisualDesignProjectEstimateSection products={products} numberScreens={appDefinition.numberScreens} />
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
