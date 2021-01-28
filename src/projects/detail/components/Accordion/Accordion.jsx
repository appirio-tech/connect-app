/**
 * Accordion components wraps SpecQuestionList.Item with question component inside and collapses its content
 * showing short form of values.
 * But also let us expand and see the whole child component.
 */
import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import cn from 'classnames'

import IconX from '../../../../assets/icons/ui-x-mark.svg'
import IconCarretDown from '../../../../assets/icons/arrow-6px-carret-down-normal.svg'

import Tooltip from 'appirio-tech-react-components/components/Tooltip/Tooltip'
import { TOOLTIP_DEFAULT_DELAY } from '../../../../config/constants'

import './Accordion.scss'

/**
 * Supported types of questions
 */
const TYPE = {
  CHECKBOX: 'checkbox',
  CHECKBOX_GROUP: 'checkbox-group',
  RADIO_GROUP: 'radio-group',
  ADD_ONS: 'add-ons',
  TEXTINPUT: 'textinput',
  TEXTBOX: 'textbox',
  NUMBERINPUT: 'numberinput',
  SKILLS: 'skills',
  SLIDER_RADIO: 'slide-radiogroup',
  SLIDER_STANDARD: 'slider-standard',
  SELECT_DROPDOWN: 'select-dropdown',
  TALENT_PICKER: 'talent-picker',
  TALENT_PICKER_V2: 'talent-picker-v2',
  JOBS_PICKER: 'jobs-picker',
}

/**
 * Create a function which can map values to labels
 *
 * @param {Object} valuesMap map values to option with labels
 *
 * @returns {Function} valueMapper
 */
const createValueMapper = (valuesMap) => (value) => (
  valuesMap[value] && (valuesMap[value].summaryLabel || valuesMap[value].label || valuesMap[value].title)
)

/**
 * Create a function which can map desision slider to labels
 *
 * @param {Object} question object
 *
 * @returns {Function} valueMapper
 */
const createSliderDecisionValueMapper = (question) => (value) => {
  const { min, max, minLabel, maxLabel } = question
  const leftValue = value - min
  const rightValue = max - value
  if (rightValue <= leftValue) {
    return maxLabel
  } else {
    return minLabel
  }
}

class Accordion extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isOpen: false,
      value: null
    }

    this.toggle = this.toggle.bind(this)
    this.updateValue = this.updateValue.bind(this)
  }

  componentDidMount() {
    const { name, value } = this.getFormControlValue(this.props)
    this.updateValue(name, value)
  }

  componentDidUpdate(oldProps) {
    if (this.props.isFormReset && !oldProps.isFormReset) {
      const { name, value } = this.getFormControlValue(this.props)
      this.updateValue(name, value)
    }
  }

  getFormControlValue(props) {
    let name
    let value

    // find formzy controls which have `value` property and get initial value
    React.Children.forEach(props.children, (listItem) => {
      React.Children.forEach(listItem.props.children, (control) => {
        ({ name, value } = control.props)
      })
    })
    return { name, value }
  }

  toggle(evt) {
    evt.preventDefault()

    this.setState({
      isOpen: !this.state.isOpen
    })
  }

  updateValue(name, value) {
    this.setState({
      value
    })
  }

  getChildrenWithValueCatcher() {
    const { children } = this.props

    // update child formzy controls and pass `onChange` handler to catch updates of values
    const newChildren = React.Children.map(children, (listItem) => {
      const newListItem = React.cloneElement(listItem, {
        ...listItem.props,
        children: React.Children.map(listItem.props.children, (control) => {
          const newControl = React.cloneElement(control, {
            ...control.props,
            // catch updates of controls values
            onChange: this.updateValue
          })

          return newControl
        })
      })

      return newListItem
    })

    return newChildren
  }

  formatValue() {
    const { type, options, question } = this.props
    const { value } = this.state

    const valuesMap = _.keyBy(options, 'value')
    const mapValue = createValueMapper(valuesMap)
    const mapDecisionValue = createSliderDecisionValueMapper(question)

    if (!value) {
      return 'N/A'//value
    }

    // we shouldn't show or count values for options which are hidden
    let nonHiddenValue = value
    if (_.isArray(value)) {
      nonHiddenValue = _.reject(value, (val) => {
        const valOption = _.find(options, { value: val })
        return _.get(valOption, '__wizard.hiddenByCondition', false)
      })
    }

    switch (type) {
    case TYPE.CHECKBOX: return value ? 'Yes' : 'No'
    case TYPE.CHECKBOX_GROUP: return nonHiddenValue.map(mapValue).join(', ')
    case TYPE.RADIO_GROUP: return mapValue(value)
    case TYPE.ADD_ONS: return `${nonHiddenValue.length} selected`
    case TYPE.SKILLS: return `${nonHiddenValue.length} selected`
    case TYPE.SLIDER_RADIO: return mapValue(value)
    case TYPE.SLIDER_STANDARD: return mapDecisionValue(value)
    case TYPE.SELECT_DROPDOWN: return mapValue(value)
    case TYPE.TALENT_PICKER: {
      const getRoleName = (role) => _.find(options, { role }).roleTitle
      const totalPeoplePerRole = _.mapValues(_.groupBy(value, v => v.role), valuesUnderGroup => _.sumBy(valuesUnderGroup, v => Number(v.people)))
      return _.toPairs(totalPeoplePerRole).filter(([, people]) => people > 0).map(([role, people]) => `${getRoleName(role)}: ${people}`).join(', ')
    }
    case TYPE.TALENT_PICKER_V2: {
      const getRoleName = (role) => _.find(options, { role }).roleTitle
      const totalPeoplePerRole = _.mapValues(_.groupBy(value, v => v.role), valuesUnderGroup => _.sumBy(valuesUnderGroup, v => Number(v.people)))
      return _.toPairs(totalPeoplePerRole).filter(([, people]) => people > 0).map(([role, people]) => `${getRoleName(role)}: ${people}`).join(', ')
    }
    case TYPE.JOBS_PICKER: {
      return _.map(value, 'title').join(', ')
    }
    default: return value
    }
  }

  render() {
    const { title } = this.props
    const { isOpen } = this.state

    const newChildren = this.getChildrenWithValueCatcher()

    return (
      <div styleName={cn('container', { 'is-open': isOpen })}>
        <button styleName="header" onClick={this.toggle}>
          <Tooltip theme="light" tooltipDelay={TOOLTIP_DEFAULT_DELAY}>
            <div className="tooltip-target">
              <h5 styleName="title">{title}</h5>
            </div>
            <div className="tooltip-body">
              {title}
            </div>
          </Tooltip>
          <div title={this.formatValue()} styleName="value">{this.formatValue()}</div>
          <div styleName="toggle">
            {isOpen ? <IconX styleName="toggle-icon" /> : <IconCarretDown styleName="toggle-icon" />}
          </div>
        </button>
        <div styleName="content">
          {newChildren}
        </div>
      </div>
    )
  }
}

Accordion.propTypes = {
  /**
   * Title will be displayed in the header of the accordion instead of standard header of a child component
   */
  title: PT.string.isRequired,

  /**
   * We support some predefined set of types, see TYPE
   */
  type: PT.oneOf(_.values(TYPE)).isRequired,

  /**
   * We need options so we can render labels of values instead of raw values
   */
  options: PT.array.isRequired,
  /**
   * Full question object
   */
  question: PT.object.isRequired,
}

export default Accordion
