require('./ProjectListNavHeader.scss')

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { PROJECT_STATUS } from '../../../../config/constants'
import SVGIcons from '../../../../components/Icons/Icons'

export default class ProjectListNavHeader extends Component {

  constructor(props) {
    super(props)
    this.state = {}
    this.onItemClick = this.onItemClick.bind(this)
    this.switchViews = this.switchViews.bind(this)
  }
  componentWillMount() {
    this.setState({
      selectedView: this.props.selectedView,
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
    if (this.state.selectedView === e.currentTarget.dataset.view)
      return
    this.setState({selectedView: e.currentTarget.dataset.view})
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
            <a href="javascript;" data-view="grid" onClick={this.switchViews} className={`list-nav-btn sm right ${(this.state.selectedView === 'grid') ? 'active' : ''}`}>
              <SVGIcons.IconGridView className="grid-view-ico" />
              <i/>
            </a>
          </div>
          <div className="list-nav-item nav-icon">
            <a href="javascript;" data-view="card" onClick={this.switchViews} className={`list-nav-btn sm right ${(this.state.selectedView === 'card') ? 'active' : ''}`}>
              <SVGIcons.IconCardView className="card-view-ico" />
              <i/>
            </a>
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
