/**
 * Work view section
 */
import React from 'react'
import PT from 'prop-types'
import { withRouter, Link } from 'react-router-dom'
import cn from 'classnames'
import FormsyForm from 'appirio-tech-react-components/components/Formsy'
const Formsy = FormsyForm.Formsy

import Section from '../Section'
import WorkViewEdit from './WorkViewEdit'
import CloseIcon from  '../../../../assets/icons/x-mark-black.svg'
import EditIcon from  '../../../../assets/icons/icon-edit-black.svg'
import SelectDropdown from '../../../../components/SelectDropdown/SelectDropdown'
import { PHASE_STATUS } from '../../../../config/constants'
import LoadingIndicator from '../../../../components/LoadingIndicator/LoadingIndicator'
import './WorkView.scss'

const phaseStatuses = PHASE_STATUS.map(ps => ({
  title: ps.name,
  value: ps.value,
}))

class WorkView extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isEditing: false,
      selectedNav: 0,
      navs:[
        {
          title: 'Details',
          content: (<div>Details tab</div>),
        },
        {
          title: 'Requirements',
          content: (<div>Requirements tab</div>),
        },
        {
          title: 'Delivery Management',
          content: (<div>Delivery Management tab</div>),
        },
        {
          title: 'Assets',
          content: (<div>Assets tab</div>),
          count: 568
        }
      ]
    }

    this.handleChange = this.handleChange.bind(this)
    this.submitEditForm = this.submitEditForm.bind(this)
  }

  /**
   * Handles the change event of the form.
   *
   * @param change changed form model in flattened form
   * @param isChanged flag that indicates if form actually changed from initial model values
   */
  handleChange(change, isChanged) {
    if (isChanged) {
      const { match: { params: { projectId, workstreamId, workId } }, updateWork } = this.props
      updateWork(projectId, workstreamId, workId, change)
    }
  }

  /**
   * Call request to submit edit form
   * @param {Object} model form value
   */
  submitEditForm(model) {
    const { match: { params: { projectId, workstreamId, workId } }, updateWork } = this.props
    updateWork(projectId, workstreamId, workId, model)
  }

  render() {
    const {
      work,
      match,
      isUpdatingWorkInfo,
      isDeletingWorkInfo
    } = this.props

    return (
      <Section>
        <div styleName="container">
          {this.state.isEditing ? (
            <WorkViewEdit
              {...this.props}
              onBack={() => { this.setState({ isEditing: false }) }}
              submitForm={this.submitEditForm}
            />
          ) : (
            <div styleName={cn('wrapper-content', { 'is-updating': isUpdatingWorkInfo })}>
              <div styleName="header">
                <span styleName="work-name">{work.name}</span>
                <div styleName="right-control">
                  <i styleName="icon-edit" onClick={() => { this.setState({ isEditing: true }) }} title="edit"><EditIcon /></i>
                  <Link to={`/projects/${match.params.projectId}`} styleName="icon-close">
                    <CloseIcon />
                  </Link>
                </div>
              </div>
              {!_.isNil(work) && (
                <Formsy.Form
                  onChange={ this.handleChange }
                  ref="form"
                >
                  <SelectDropdown
                    name="status"
                    value={work.status}
                    theme="default"
                    options={phaseStatuses}
                  />
                </Formsy.Form>
              )}
              <div styleName="nav">
                {this.state.navs.map((nav, index) => (
                  <div
                    key={nav.title}
                    styleName={cn('nav-item', { 'is-selected': index === this.state.selectedNav })}
                    onClick={() => { this.setState({ selectedNav: index }) }}
                  >
                    <span styleName="nav-name">{nav.title}</span>
                    {!_.isNil(nav.count) && (<span styleName="nav-count">568</span>)}
                  </div>
                ))}
              </div>
              <div styleName="content">
                {this.state.navs[this.state.selectedNav].content}
              </div>
            </div>
          )}
          {(isUpdatingWorkInfo || isDeletingWorkInfo) && (<div styleName="loading-wrapper">
            <LoadingIndicator />
          </div>)}
        </div>
      </Section>
    )
  }
}

WorkView.defaultProps = {
}

WorkView.propTypes = {
  work: PT.shape({
    id: PT.number,
    name: PT.string,
    status: PT.string,
    description: PT.string,
  }).isRequired,
  updateWork: PT.func.isRequired,
  isUpdatingWorkInfo: PT.bool.isRequired,
  isDeletingWorkInfo: PT.bool.isRequired
}

export default withRouter(WorkView)
