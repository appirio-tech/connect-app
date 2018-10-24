import React, { Component } from 'react'
import { connect } from 'react-redux'
import LayoutView from './Layout.jsx'
import { loadUser } from '../../actions/loadUser'
import { loadSearchSuggestions, search } from '../../actions/navSearch'
import { getProfileSettings } from '../../routes/settings/actions/index'

class Layout extends Component {
  constructor(props) {
    super(props)
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.user === null && nextProps.user !== null) {
      this.props.getProfileSettings()
    }
  }

  componentWillMount() {
    this.props.loadUser()
  }

  render() {
    return React.createElement(LayoutView, this.props)
  }
}

const mapStateToProps = ({ loadUser, projectState, projectSearch, settings }) => {
  const projectDetailApiCheck = !projectState.isLoading && !!projectState.error && [502, 503].indexOf(projectState.error.code) !== -1
  const projectListingApiCheck = !projectSearch.isLoading && !!projectSearch.error && [502, 503].indexOf(projectSearch.error.code) !== -1
  return {
    user : loadUser.user,
    profile: settings.profile.settings,
    isLoadingUser: loadUser.isLoading,
    maintenanceMode: projectDetailApiCheck || projectListingApiCheck
  }
}

const actionsToBind = { loadUser, loadSearchSuggestions, search, getProfileSettings }

export default connect(mapStateToProps, actionsToBind)(Layout)
