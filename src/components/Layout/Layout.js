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

const mapStateToProps = ({ loadUser }) => {
  return {
    user : loadUser.user,
    isLoadingUser: loadUser.isLoading
  }
}

const actionsToBind = { loadUser, loadSearchSuggestions, search }

export default connect(mapStateToProps, actionsToBind)(Layout)
