import React from 'react'
import PropTypes from 'prop-types'
import { flatten } from 'flat'

import { SCOPE_CHANGE_REQ_STATUS_PENDING, SCOPE_CHANGE_REQ_STATUS_APPROVED } from '../../../../config/constants'

import styles from './ScopeChangeRequest.scss'

/**
 * The component that renders the changes in new scope change request from the old scope
 * in a readable format
 */
class ScopeChangeRequest extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      changes: []
    }
  }

  componentWillReceiveProps(newProps) {
    const changes = this.getChanges(newProps)

    this.setState({
      changes
    })
  }

  componentDidMount() {
    this.setState({
      changes: this.getChanges(this.props)
    })
  }

  getDiff(oldScope, newScope) {
    const oldFlatScope = flatten(oldScope, { safe: true })
    const newFlatScope = flatten(newScope, { safe: true })

    return _.omitBy(newFlatScope, (newValue, key) => _.isEqual(oldFlatScope[key], newValue))
  }

  deduceFieldLabel(template, invertedScopeFieldPaths, fieldkey) {
    const key = invertedScopeFieldPaths[`details.${fieldkey}`].replace(/\.fieldName$/, '')
    const fieldDescriptionObject = _.get(template, key)

    return fieldDescriptionObject.summaryTitle || fieldDescriptionObject.title
  }

  /*
    Fieldnames from the template holds the full property path for values in the form
    e.g. "details.appDefinition.numberScreens" could be the full property path for the value of "number of screens"
    in the form model.

    And the full property path of the fieldname that holds this info could be
    something like template.sections[1].subSections[2]questions[0].fieldName
    i.e. template.sections[1].subSections[2]questions[0].fieldName === "details.appDefinition.numberScreens"

    We need to know the full path of the fieldname to derive a meaningful label for the field.
    The label would be available in template.sections[1].subSections[2]questions[0] as summaryTitle or title
  */
  getInvertedScopeFieldPaths(flatTemplate) {
    const scopeFieldPaths = _.omitBy(flatTemplate, (value, key) => {
      return !_.isString(value) || !key.match(/fieldName$/) || !value.match(/^details\./)
    })
    return _.invert(scopeFieldPaths)
  }

  getChanges(props) {
    const { pendingScopeChange, template } = props
    const { oldScope, newScope } = pendingScopeChange

    const diff = this.getDiff(oldScope, newScope)
    const flatTemplate = flatten(template)
    const invertedScopeFieldPaths = this.getInvertedScopeFieldPaths(flatTemplate)

    return _.entries(diff).map(([diffKey, newVal]) => {
      const oldVal = _.get(oldScope, diffKey)
      const label = this.deduceFieldLabel(template, invertedScopeFieldPaths, diffKey)

      const formatValue = value => (_.isEmpty(value) ? '(empty)' : JSON.stringify(value, null, ' '))

      return {
        label,
        from: formatValue(oldVal),
        to: formatValue(newVal),
        key: diffKey
      }
    })
  }

  render() {
    const { changes } = this.state
    const {
      isCustomer,
      isRequestor,
      isManager,
      isAdmin,
      pendingScopeChange,
      onActivate,
      onApprove,
      onCancel,
      onReject
    } = this.props

    const status = pendingScopeChange.status
    const isPending = status === SCOPE_CHANGE_REQ_STATUS_PENDING
    const isApproved = status === SCOPE_CHANGE_REQ_STATUS_APPROVED

    return (
      <div className={styles.card}>
        <div className={styles.cardTitle}>Scope Change Request</div>
        {changes.map(c => (
          <div key={c.key} className={styles.changeItem}>
            {c.label} changed to <span className={styles.newValue}>{c.to}</span> from{' '}
            <span className={styles.oldValue}>{c.from}</span>
          </div>
        ))}

        {status === SCOPE_CHANGE_REQ_STATUS_APPROVED && isCustomer && (
          <div className={styles.note}>Note: This change is awaiting activation.</div>
        )}

        <div className={styles.buttonsContainer}>
          {(isCustomer || isAdmin) && isPending && (
            <button className="tc-btn tc-btn-primary tc-btn-md" onClick={onApprove}>
              Approve
            </button>
          )}
          {(isCustomer || isAdmin) && isPending && (
            <button className="tc-btn tc-btn-warning tc-btn-md" onClick={onReject}>
              Reject
            </button>
          )}
          {(isManager || isAdmin) && isApproved && (
            <button className="tc-btn tc-btn-primary tc-btn-md" onClick={onActivate}>
              Activate
            </button>
          )}
          {isRequestor && isPending && (
            <button className="tc-btn tc-btn-warning tc-btn-md" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </div>
    )
  }
}

ScopeChangeRequest.propTypes = {
  isCustomer: PropTypes.bool,
  isRequestor: PropTypes.bool,
  isManager: PropTypes.bool,
  isAdmin: PropTypes.bool,
  pendingScopeChange: PropTypes.object.isRequired,
  template: PropTypes.object.isRequired,
  onApprove: PropTypes.func,
  onActivate: PropTypes.func,
  onReject: PropTypes.func,
  onCancel: PropTypes.func
}

export default ScopeChangeRequest
