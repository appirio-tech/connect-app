import React from 'react'
import {HOC as hoc} from 'formsy-react'

import Select from '../../../../components/Select/Select'
import {fetchBillingAccounts} from '../../../../api/billingAccounts'
import {SALESFORCE_PROJECT_LEAD_LINK} from '../../../../config/constants'

import styles from './styles.module.scss'

class BillingAccountField extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      billingAccounts: [],
      selectedBillingAccount: this.props.billingAccountId
    }

    this.handleChange = this.handleChange.bind(this)
    this.mapOpts = this.mapOpts.bind(this)
  }

  componentDidMount() {
    fetchBillingAccounts(this.props.projectId)
      .then(({data: billingAccounts}) => this.setState({billingAccounts}))
      .then(() => {
        if (this.props.billingAccountId) {
          this.setState(state => {
            const existentBillingAccount = _.find(state.billingAccounts, {
              tcBillingAccountId: this.props.billingAccountId
            })
            if (!existentBillingAccount) {
              const billingAccountObj = {
                name: '<Assigned Account>',
                tcBillingAccountId: this.props.billingAccountId
              }
              return {
                billingAccounts: [...state.billingAccounts, billingAccountObj],
                selectedBillingAccount: this.mapOpts(billingAccountObj)
              }
            } else {
              return {
                selectedBillingAccount: this.mapOpts(existentBillingAccount)
              }
            }
          })
        }
      })
      .catch(console.error)
  }

  handleChange(value) {
    this.setState({selectedBillingAccount: value})
    this.props.setValue(value.value)
  }

  mapOpts(opt) {
    return {
      label: `${opt.name} (${opt.tcBillingAccountId})`,
      value: opt.tcBillingAccountId
    }
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.fieldName}>Choose a Billing Account</div>
        <Select
          placeholder={
            this.state.billingAccounts.length > 0 
              ? 'Select billing account'
              : 'No Billing Account Available'
          }
          onChange={this.handleChange}
          value={this.state.selectedBillingAccount}
          options={this.state.billingAccounts.map(this.mapOpts)}
          isDisabled={this.state.billingAccounts.length === 0}
        />
        <a
          className={styles.manageBillingAccountLink}
          href={`${SALESFORCE_PROJECT_LEAD_LINK}${this.props.projectId}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Manage the billing account in Salesforce
        </a>
      </div>
    )
  }
}

export default hoc(BillingAccountField)
