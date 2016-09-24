import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

class Home extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    // redirect to project list if user is logged in.
    if (this.props.isLoggedIn)
      this.props.router.push('/projects')
  }

  render() {
    return (
      <h3> New Connect Home </h3>
    )
  }
}

const mapStateToProps = ({loadUser}) => {
  return {
    isLoggedIn: loadUser.isLoggedIn
  }
}

export default withRouter(connect(mapStateToProps)(Home))
