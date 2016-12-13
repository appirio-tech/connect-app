
import Formsy from 'formsy-react'

import TextInput from './TextInput'
import Textarea from './Textarea'
import Checkbox from './Checkbox'
import RadioGroup from './RadioGroup'
import CheckboxGroup from './CheckboxGroup'
import SliderRadioGroup from './SliderRadioGroup'
import TiledRadioGroup from './TiledRadioGroup'

require('./FormFields.scss')

const RELAXED_URL_REGEX = /^(http(s?):\/\/)?(www\.)?[a-zA-Z0-9\.\-\_]+(\.[a-zA-Z]{2,15})+(\/[a-zA-Z0-9\_\-\s\.\/\?\%\#\&\=]*)?$/

// validations
Formsy.addValidationRule('isRequired', (values, value, array) => { // eslint-disable-line no-unused-vars
  return value && value.trim().length > 0
})

Formsy.addValidationRule('isRelaxedUrl', (values, value, array) => { // eslint-disable-line no-unused-vars
  return !value || RELAXED_URL_REGEX.test(value)
})

export default {
  Formsy,
  Fields: {
    TextInput,
    Textarea,
    RadioGroup,
    Checkbox,
    CheckboxGroup,
    SliderRadioGroup,
    TiledRadioGroup
  }
}
