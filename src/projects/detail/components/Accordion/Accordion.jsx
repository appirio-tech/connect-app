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
  CHECKBOX_GROUP: 'checkbox-group',
  RADIO_GROUP: 'radio-group',
  ADD_ONS: 'add-ons',
  TEXTINPUT: 'textinput',
  TEXTBOX: 'textbox',
  NUMBERINPUT: 'numberinput',
  SKILLS: 'skills',
  SLIDER_RADIO: 'slide-radiogroup',
  SELECT_DROPDOWN: 'select-dropdown'
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
    const { children } = this.props

    // find formzy controls which have `value` property and get initial value for `value`
    React.Children.forEach(children, (listItem) => {
      React.Children.forEach(listItem.props.children, (control) => {
        this.updateValue(control.props.name, control.props.value)
      })
    })
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
    const { type, options } = this.props
    const { value } = this.state

    const valuesMap = _.keyBy(options, 'value')
    const mapValue = createValueMapper(valuesMap)

    if (!value) {
      return 'N/A'//value
    }

    switch (type) {
    case TYPE.CHECKBOX_GROUP: return value.map(mapValue).join(', ')
    case TYPE.RADIO_GROUP: return mapValue(value)
    case TYPE.ADD_ONS: return `${value.length} selected`
    case TYPE.SKILLS: return `${value.length} selected`
    case TYPE.SLIDER_RADIO: return mapValue(value)
    case TYPE.SELECT_DROPDOWN: return mapValue(value)
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
          <div styleName="value">{this.formatValue()}</div>
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
}

export default Accordion
