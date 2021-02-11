import React from 'react'
import {connect} from 'react-redux'
import _ from 'lodash'
import FormsyForm from 'appirio-tech-react-components/components/Formsy'
const Formsy = FormsyForm.Formsy
import { updateProject } from '../../../actions/project'
import NDAField from '../NDAField'
import GroupsField from '../GroupsField'

import './EditProjectDefaultsForm.scss'

class EditProjectDefaultsForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      enableButton: false,
      isLoading: true
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount() {
    this.setState({isLoading: false, project: this.props.project})
  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(prevProps.project, this.props.project)) {
      this.setState({project: this.props.project})
    }
  }

  handleChange(changed) {
    const keys = _.intersection(Object.keys(changed), Object.keys(this.state.project))
    const reqProjectState = keys.reduce((acc, curr) => {
      acc[curr] = changed[curr]
      return acc
    }, {})
    const project = _.assign({}, this.state.project, reqProjectState)
    this.setState({project})
    const isProjectEqual = _.isEqual(this.state.project, this.props.project)
    if (!isProjectEqual && !this.state.enableButton) {
      this.setState({enableButton: true})
    } else if (isProjectEqual && this.state.enableButton !== false) {
      this.setState({enableButton: false})
    }
  }

  handleSubmit() {
    const {updateProject} = this.props
    const {id} = this.props.project
    const updateProjectObj = Object.keys(this.state.project)
      .filter(key => !_.isEqual(this.props.project[key], this.state.project[key]))
      .reduce((acc, curr) => {
        acc[curr] = this.state.project[curr]
        return acc
      }, {})
    updateProject(id, updateProjectObj)
      .then(() => this.setState({enableButton: false}))
      .catch(console.error)
  }

  render() {
    if (this.state.isLoading) return null

    return (
      <div className="edit-project-defaults-form">
        <Formsy.Form
          onValidSubmit={this.handleSubmit}
          onChange={this.handleChange}
        >
          <div className="container">
            <NDAField
              name="terms"
              value={this.state.project.terms}
            />
            <GroupsField
              name="groups"
              value={this.state.project.groups}
            />
          </div>
          <div className="section-footer section-footer-spec">
            <button
              className="tc-btn tc-btn-primary tc-btn-md"
              type="submit"
              disabled={!this.state.enableButton}
            >
              Save
            </button>
          </div>
        </Formsy.Form>
      </div>
    )
  }
}

const mapDispatchToProps = {
  updateProject
}

export default connect(null, mapDispatchToProps)(EditProjectDefaultsForm)
