import React, { Component } from 'react'
import { connect } from 'react-redux'

class ReportDashboard extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (<div>Reports</div>)
  }
}

const mapStateToProps = ({ projectSearch, searchTerm }) => {
  return {
  }
}

const actionsToBind = { }

export default connect(mapStateToProps, actionsToBind)(ReportDashboard)
