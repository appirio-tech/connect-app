/**
 * Email verification container.
 * 
 * This container sends request to the backend to verify a new email and shows
 * success/failure/expired message according to the backend response.
 */
import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import axios from 'axios'
import { withRouter } from 'react-router-dom'

import LoadingIndicator from '../../../../../components/LoadingIndicator/LoadingIndicator' 
import Success from '../components/Success'
import Failure from '../components/Failure'
import Expired from '../components/Expired'

import { TC_API_URL } from '../../../../../config/constants'

class SuccessContainer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: true,
      statusCode: null,
    }
  }

  componentDidMount() {
    const { match } = this.props

    setTimeout(() => axios
      .post(`${TC_API_URL}/v3/members/${match.params.handle}/verify?newEmail=${match.params.newEmail}&oldEmail=${match.params.oldEmail}&token=${match.params.token}`, {}, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${match.params.jwtToken}`
        }
      })
      .then(res => this.setState({ statusCode: res.status, isLoading: false }))
      .catch(err => this.setState({ statusCode: _.get(err, 'response.status', 400), isLoading: false })), 2000)
  }

  render() {
    const { isLoading, statusCode } = this.state

    if (isLoading) {
      return <LoadingIndicator />
    }

    switch (statusCode) {
    case 200: return <Success />
    case 401: return <Expired />
    default: return <Failure />
    }
  }
}

SuccessContainer.propTypes = {
  match: PT.shape({
    params: PT.shape({
      handle: PT.string.isRequired,
      token: PT.string.isRequired,
      newEmail: PT.string.isRequired,
      oldEmail: PT.string.isRequired,
      jwtToken: PT.string.isRequired,
    }),
  }).isRequired,
}

export default withRouter(SuccessContainer)