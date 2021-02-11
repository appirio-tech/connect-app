import React, { PropTypes } from 'react'
import { HOC as hoc } from 'formsy-react'
import _ from 'lodash'
import RadioGroup from 'appirio-tech-react-components/components/Formsy/RadioGroup'
import { DEFAULT_NDA_UUID } from '../../../../../config/constants'

class NDAField extends React.Component {
  constructor(props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(value) {
    const {name, value: propsValue, onChange, setValue} = this.props
    const newValue = [...propsValue]
    const idx = newValue.indexOf(DEFAULT_NDA_UUID)
    if (idx >= 0 && (value === 'no')) {
      newValue.splice(idx, 1)
    } else if (value === 'yes' && idx < 0) {
      newValue.push(DEFAULT_NDA_UUID)
    }
    setValue(newValue)
    onChange({[name]: newValue})
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
    return (
      <fieldset>
        <legend>Enforce Topcoder NDA</legend>
        <RadioGroup
          name="nda"
          options={opts}
          value={_.includes(this.props.value, DEFAULT_NDA_UUID) ? 'yes' : 'no'}
          setValue={this.handleChange}
        />
      </fieldset>
    )
  }
}

NDAField.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.array.isRequired,
  setValue: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired
}

NDAField.defaultProps = {
  onChange: () => {}
}

export default hoc(NDAField)
