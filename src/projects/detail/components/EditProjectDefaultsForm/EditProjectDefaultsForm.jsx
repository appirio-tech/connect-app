import React from 'react'
import {connect} from 'react-redux'
import _ from 'lodash'
import FormsyForm from 'appirio-tech-react-components/components/Formsy'
const Formsy = FormsyForm.Formsy
import { updateProject } from '../../../actions/project'
import SpecQuestionList from '../SpecQuestionList/SpecQuestionList'
import NDAField from '../NDAField'

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
    if (!_.isEqual(this.state.project, this.props.project) && !this.state.enableButton) {
      this.setState({enableButton: true})
    } else if (this.state.enableButton !== false) {
      this.setState({enableButton: false})
    }
  }

  async handleSubmit() {
    const {updateProject} = this.props
    const {id} = this.props.project
    try {
      const updateProjectObj = Object.keys(this.state.project)
        .filter(key => !_.isEqual(this.props.project[key], this.state.project[key]))
        .reduce((acc, curr) => {
          acc[curr] = this.state.project[curr]
          return acc;
        }, {})
      await updateProject(id, updateProjectObj)
      this.setState({enableButton: false})
    } catch (err) {
      console.error(err)
    }
  }

  render() {
    if (this.state.isLoading) return null;

    return (
      <div className="edit-project-defaults-form">
        <Formsy.Form
          onValidSubmit={this.handleSubmit}
          onChange={this.handleChange}
        >
          <div className="container">
            <SpecQuestionList>
              <NDAField
                name="terms"
                value={this.state.project.terms}
              />
            </SpecQuestionList>
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
