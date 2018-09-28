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
  const projectDetailApiCheck = !projectState.isLoading && !!projectState.error && [502, 503].contains(projectState.error.code)
  const projectListingApiCheck = !projectSearch.isLoading && !!projectSearch.error && [502, 503].contains(projectSearch.error.code)
  return {
    user : loadUser.user,
    isLoadingUser: loadUser.isLoading,
    maintenanceMode: projectDetailApiCheck || projectListingApiCheck
  }
}

const actionsToBind = { loadUser, loadSearchSuggestions, search }

export default connect(mapStateToProps, actionsToBind)(Layout)
