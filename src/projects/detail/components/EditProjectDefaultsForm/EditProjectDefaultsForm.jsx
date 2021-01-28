import React from 'react'
import {connect} from 'react-redux'
import FormsyForm from 'appirio-tech-react-components/components/Formsy'
const Formsy = FormsyForm.Formsy
import RadioGroup from 'appirio-tech-react-components/components/Formsy/RadioGroup'
import SpecQuestionList from '../SpecQuestionList/SpecQuestionList'
import Accordion from '../Accordion/Accordion'
import { updateProject } from '../../../actions/project'
import { DEFAULT_NDA_UUID } from '../../../../../config/constants'

import './EditProjectDefaultsForm.scss'

class EditProjectDefaultsForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      hasNda: false,
      enableButton: false,
      isLoading: true
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount() {
    const {terms} = this.props.project
    if (terms.indexOf(DEFAULT_NDA_UUID) >= 0) {
      this.setState({hasNda: true})
    }
    this.setState({isLoading: false})
  }

  handleChange({nda}) {
    if ((nda === 'yes') !== this.state.hasNda) {
      if (this.state.enableButton !== true) {
        this.setState({enableButton: true})
      }
    } else {
      if (this.state.enableButton !== false) {
        this.setState({enableButton: false})
      }
    }
  }

  handleSubmit() {
    const {updateProject} = this.props
    const {id, terms} = this.props.project
    const newHasNda = !this.state.hasNda
    if (newHasNda) {
      updateProject(id, {
        terms: [...new Set([...terms, DEFAULT_NDA_UUID])]
      }, true).then(() => {
        this.setState({
          hasNda: this.props.project.terms.indexOf(DEFAULT_NDA_UUID) >= 0
        })
      })
    } else {
      const newTerms = [...terms]
      if (newTerms.indexOf(DEFAULT_NDA_UUID) >= 0) {
        newTerms.splice(newTerms.indexOf(DEFAULT_NDA_UUID), 1)
        updateProject(id, {
          terms: newTerms
        }, true).then(() => {
          this.setState({
            hasNda: this.props.project.terms.indexOf(DEFAULT_NDA_UUID) >= 0
          })
        })
      }
    }
  }

  render() {
    const opts = [
      {
        value: 'yes',
        label: 'Yes'
      },
      {
        value: 'no',
        label: 'No'
      }
    ]

    if (this.state.isLoading) return null

    return (
      <div className="edit-project-defaults-form">
        <Formsy.Form
          onValidSubmit={this.handleSubmit}
          onChange={this.handleChange}
        >
          <div className="container">
            <SpecQuestionList>
              <Accordion
                title="Enforce Topcoder NDA"
                type="radio-group"
                options={opts}
              >
                <SpecQuestionList.Item>
                  <RadioGroup
                    name="nda"
                    options={opts}
                    value={this.state.hasNda ? 'yes' : 'no'}
                  />
                </SpecQuestionList.Item>
              </Accordion>
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
