import _ from 'lodash'
import React, { PropTypes, Component } from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import SidebarNav from './SidebarNav'
import VisualDesignProjectEstimateSection from './VisualDesignProjectEstimateSection'
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
      browserHistory.push(`/projects/${project.id}`)
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
      const { appDefinition, products } = project.details

      // project estimate only available for visual design porjects right now
      // estimation is support with introduction of products, hence it would rendered only for new projects
      if (project.type !== 'visual_design' || !products) return

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

export default connect(null, mapDispatchToProps)(ProjectSpecSidebar)
