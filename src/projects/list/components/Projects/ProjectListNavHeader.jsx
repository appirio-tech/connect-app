require('./ProjectListNavHeader.scss')

import _ from 'lodash'
import querystring from 'query-string'
import React, { Component } from 'react'
import PT from 'prop-types'
import { PROJECT_STATUS } from '../../../../config/constants'
import CardView from '../../../../assets/icons/ui-16px-2_grid-45-gray.svg'
import GridView from '../../../../assets/icons/grid-list-ico.svg'
import { SwitchButton } from 'appirio-tech-react-components'


export default class ProjectListNavHeader extends Component {

  constructor(props) {
    super(props)
    this.state = {}
    this.onItemClick = this.onItemClick.bind(this)
    this.switchViews = this.switchViews.bind(this)
    this.handleMyProjectsFilter = this.handleMyProjectsFilter.bind(this)
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

  handleMyProjectsFilter(e) {

    this.applyFilters({memberOnly: e.target.checked})
  }

  applyFilters(filter) {

    const criteria = _.assign({}, this.props.criteria, filter)
    if (criteria && criteria.keyword) {
      criteria.keyword = encodeURIComponent(criteria.keyword)
      // force sort criteria to best match
      criteria.sort = 'best match'
    }
    this.routeWithParams(criteria)
  }

  routeWithParams(criteria) {
    // because criteria is changed disable infinite autoload
    this.props.setInfiniteAutoload(false)
    // remove any null values
    criteria = _.pickBy(criteria, _.identity)
    this.props.history.push({
      pathname: '/projects',
      search: '?' + querystring.stringify(_.assign({}, criteria))
    })
    this.props.loadProjects(criteria)
  }

  render() {
    const options = [
      { status: null, label: 'All projects' },
      ...PROJECT_STATUS.sort((a, b) => { 
        if ( a.order < b.order ){
          return -1
        }
        if ( a.order > b.order ){
          return 1
        }
        return 0
      }).map((item) => ({status: item.value, label: item.name}))
    ]

    return (
      <nav className="list-nav-container">
        <ul className="left-wrapper">
          {
            options.map((item, i) =>
              (<li className="list-nav-item" key={i}>
                <a href="javascript;" data-status={item.status} onClick={this.onItemClick} className={`list-nav-btn lg ${(item.label === 'All Statuses' && !this.state.currentStatus) || this.state.currentStatus === item.status ? 'active' : ''}`}>{item.label}</a>
              </li>)
            )
          }
        </ul>
        <div className="right-wrapper">

          <div className="primary-filter">
            <div className="tc-switch clearfix">
              <SwitchButton
                onChange={ this.handleMyProjectsFilter }
                label="My projects"
                name="my-projects-only"
                checked={this.props.criteria.memberOnly}
              />
            </div>
          </div>
          <div className="list-nav-item nav-icon">
            <a href="javascript;" data-view="grid" onClick={this.switchViews} className={`list-nav-btn sm right ${(this.state.selectedView === 'grid') ? 'active' : ''}`}>
              <GridView className="grid-view-ico" />
            </a>
          </div>
          <div className="list-nav-item nav-icon">
            <a href="javascript;" data-view="card" onClick={this.switchViews} className={`list-nav-btn sm right ${(this.state.selectedView === 'card') ? 'active' : ''}`}>
              <CardView className="card-view-ico" />
            </a>
          </div>
        </div>
      </nav>
    )
  }
}
ProjectListNavHeader.propTypes = {
  applyFilters: PT.func.isRequired,
  changeView: PT.func.isRequired,
  criteria: PT.object.isRequired,
  history: PT.object.isRequired,
  setInfiniteAutoload: PT.func.isRequired,
  loadProjects: PT.func.isRequired
}
