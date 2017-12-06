require('./ProjectListNavHeader.scss')

import React, {PropTypes, Component} from 'react'

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
  onItemClick (e) {
    e.preventDefault()
    this.setState({ currentStatus : e.currentTarget.dataset.status })
    this.props.applyFilters({status : e.currentTarget.dataset.status})
  }

  switchViews(e) {
    e.preventDefault()
    if (this.state.selectedView === e.currentTarget.dataset.view)
      return
    window.location = window.location.protocol + '//' + window.location.host +  window.location.pathname + '?view=' + e.currentTarget.dataset.view

  }

  render() {
    const options = [
      { status: 'active', label: 'Active Projects' },
      { status: 'draft', label: 'Draft' },
      { status: 'reviewed', label: 'Reviewed' },
      { status: 'completed', label: 'Completed' },
      { status: 'cancelled', label: 'Canceled' }
    ]

    return (
      <div className="list-nav-container">
        <div className="left-wrapper">
        {
          options.map((item, i) =>
            <div className="list-nav-item" key={i}>
              <a href="javascript;" data-status={item.status} onClick={this.onItemClick} className={`list-nav-btn lg ${(this.state.currentStatus === item.status) ? 'active' : ''}`}>{item.label}</a>
            </div>
          )
        }
        </div>
        <div className="right-wrapper">
          <div className="list-nav-item nav-icon">
            <a href="javascript;" data-view="grid" onClick={this.switchViews} className={`list-nav-btn sm right grid-view-ico ${(this.state.selectedView === 'grid') ? 'active' : ''}`}><i/></a>
          </div>
          <div className="list-nav-item nav-icon">
            <a href="javascript;" data-view="card" onClick={this.switchViews} className={`list-nav-btn sm right card-view-ico ${(this.state.selectedView === 'card') ? 'active' : ''}`}><i/></a>
          </div>
        </div>
      </div>
    )
  }
}
ProjectListNavHeader.propTypes = {
  applyFilters: PropTypes.func.isRequired
}
