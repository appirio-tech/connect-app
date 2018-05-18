import React from 'react'
import PT from 'prop-types'
import ProjectProgress from '../../ProjectProgress/ProjectProgress'
import './PhaseCard.scss'

class PhaseCard extends React.Component {
  constructor(props) {
    super(props)
    this.toggleCardView = this.toggleCardView.bind(this)

    this.state = {
      isExpanded: ''
    }
  }

  toggleCardView() {
    this.setState({
      isExpanded: !this.state.isExpanded
    })
  }

  render() {
    const { attr } = { ...this.props }
    return (
      <div styleName={'phase-card ' + (this.state.isExpanded ? 'expanded' : '')}>
        <div styleName="static-view">
          <div styleName="col">
            <div styleName="project-details">
              <i styleName={'project-ico ' + attr.type} />
              <h4 styleName="project-title">{attr.title}</h4>
              <div styleName="meta-list">
                <span styleName="meta">{attr.duration}</span>
                <span styleName="meta">{attr.startEndDates}</span>
                <span styleName="meta">{attr.posts}</span>
              </div>
            </div>
          </div>
          <div styleName="col">
            <div styleName="price-details">
              <h5>{attr.price}</h5>
              <div styleName="meta-list">{attr.paidStatus}</div>
            </div>
          </div>

          <div styleName="col">
            {attr && attr.status && attr.status.toLowerCase() !== 'inprogress' && 
            (<div styleName="status-details">
              <div styleName={'status ' + (attr.status ? attr.status.toLowerCase() : '')}>
                {attr.status}
              </div>
            </div>)
            }

            {attr && attr.status && attr.status.toLowerCase() === 'inprogress' && 
              (<div styleName="status-details">
                <div styleName={'status ' + (attr.status ? attr.status.toLowerCase() : '')}>

                  <ProjectProgress
                    title=""
                    viewType={ProjectProgress.ViewTypes.CIRCLE}
                    percent={attr.progressInPercent || 0}
                    thickness = {7}
                  >
                    <span className="progress-text">{attr.progressInPercent || 0}% <span className="unit">completed</span></span>
                  </ProjectProgress>

                </div>
              </div>)
            }
          </div>

          <a styleName="toggle-arrow"
            onClick={this.toggleCardView}
          />
        </div>
        <div styleName="expandable-view">
          {this.props.children}
        </div>
      </div>
    )
  }
}

PhaseCard.propTypes = {
  attr: PT.object
}

export default PhaseCard
