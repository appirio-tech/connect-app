require('./ProjectListNavHeader.scss')

import _ from 'lodash'
import querystring from 'query-string'
import React, { Component } from 'react'
import PT from 'prop-types'
import StatusFilters from '../../../../components/StatusFilters/StatusFilters'
import StatusFiltersMobile from '../../../../components/StatusFilters/StatusFiltersMobile'
import MediaQuery from 'react-responsive'
import { SCREEN_BREAKPOINT_SM } from '../../../../config/constants'
import CardView from '../../../../assets/icons/ui-16px-2_grid-45-gray.svg'
import GridView from '../../../../assets/icons/grid-list-ico.svg'
import { SwitchButton } from 'appirio-tech-react-components'


export default class ProjectListNavHeader extends Component {

  constructor(props) {
    super(props)
    this.state = {}
    this.onStatusClick = this.onStatusClick.bind(this)
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
  onStatusClick(status) {
    this.setState({ currentStatus : status })
    this.props.applyFilters({ status })
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
      criteria.keyword = criteria.keyword
      // force sort criteria to updatedAt desc
      criteria.sort = 'updatedAt desc'
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
    return (
      <nav className="list-nav-container">
        <div className="left-wrapper">
          <MediaQuery minWidth={SCREEN_BREAKPOINT_SM}>
            {(matches) => (
              matches ? (
                <StatusFilters currentStatus={this.state.currentStatus} onStatusClick={this.onStatusClick}/>
              ) : (
                <StatusFiltersMobile currentStatus={this.state.currentStatus} onStatusClick={this.onStatusClick}/>
              )
            )}
          </MediaQuery>
          {(!this.props.isCustomer) && 
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
          }
        </div>
        {(!this.props.isCustomer) &&
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
        }
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
  loadProjects: PT.func.isRequired,
  isCustomer: PT.bool.isRequired
}
