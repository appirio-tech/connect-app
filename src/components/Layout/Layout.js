import React, { Component } from 'react'
import { connect } from 'react-redux'
import LayoutView from './Layout.jsx'
import { loadUser } from '../../actions/loadUser'
import { loadSearchSuggestions, search } from '../../actions/navSearch'

class Layout extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.props.loadUser()
  }

  render() {
    return React.createElement(LayoutView, this.props)
  }
}

const mapStateToProps = ({ loadUser, projectState, projectSearch }) => {
  const projectDetailApiCheck = !projectState.isLoading && !!projectState.error && [502, 503].indexOf(projectState.error.code) !== -1
  const projectListingApiCheck = !projectSearch.isLoading && !!projectSearch.error && [502, 503].indexOf(projectSearch.error.code) !== -1
  return {
    user : loadUser.user,
    isLoadingUser: loadUser.isLoading,
    maintenanceMode: projectDetailApiCheck || projectListingApiCheck
  }
}

const actionsToBind = { loadUser, loadSearchSuggestions, search }

export default connect(mapStateToProps, actionsToBind)(Layout)
