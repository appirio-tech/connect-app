require('./ProjectListNavHeader.scss')

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { PROJECT_STATUS, PROJECTS_LIST_VIEW } from '../../../../config/constants'

export default class ProjectListNavHeader extends Component {

  constructor(props) {
    super(props)
    this.state = {}
    this.onItemClick = this.onItemClick.bind(this)
    this.switchViews = this.switchViews.bind(this)
  }
  componentWillMount() {
    this.setState({
      currentStatus: this.props.currentStatus
    })
  }
  componentWillReceiveProps(nextProps) {
    if (this.state.currentStatus !== nextProps.currentStatus) {
      this.setState({currentStatus : nextProps.currentStatus})
    }
  }
  onItemClick (e) {
    e.preventDefault()
    this.setState({ currentStatus : e.currentTarget.dataset.status })
    this.props.applyFilters({status : e.currentTarget.dataset.status})
  }

  switchViews(e) {
    e.preventDefault()
    if (this.props.selectedView === e.currentTarget.dataset.view)
      return
    this.props.changeView(e.currentTarget.dataset.view)
  }

  render() {
    const options = [
      { status: null, label: 'All projects' },
      ...PROJECT_STATUS.sort((a, b) => a.order > b.order).map((item) => ({status: item.value, label: item.name}))
    ]

    return (
      <nav className="list-nav-container">
        <ul className="left-wrapper">
        {
          options.map((item, i) =>
            <li className="list-nav-item" key={i}>
              <a href="javascript;" data-status={item.status} onClick={this.onItemClick} className={`list-nav-btn lg ${(item.label === 'All Statuses' && !this.state.currentStatus) || this.state.currentStatus === item.status ? 'active' : ''}`}>{item.label}</a>
            </li>
          )
        }
      </ul>
        <div className="right-wrapper">
          <div className="list-nav-item nav-icon">
            <a href="javascript;" data-view={PROJECTS_LIST_VIEW.GRID} onClick={this.switchViews} className={`list-nav-btn sm right grid-view-ico ${(this.props.selectedView === PROJECTS_LIST_VIEW.GRID) ? 'active' : ''}`}><i/></a>
          </div>
          <div className="list-nav-item nav-icon">
            <a href="javascript;" data-view={PROJECTS_LIST_VIEW.CARD} onClick={this.switchViews} className={`list-nav-btn sm right card-view-ico ${(this.props.selectedView === PROJECTS_LIST_VIEW.CARD) ? 'active' : ''}`}><i/></a>
          </div>
        </div>
      </nav>
    )
  }
}
ProjectListNavHeader.propTypes = {
  applyFilters: PropTypes.func.isRequired,
  changeView: PropTypes.func.isRequired
}
