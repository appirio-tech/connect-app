
import React, { Component, PropTypes } from 'react'
import { actions as modelActions } from 'react-redux-form'
import { connect } from 'react-redux'
import _ from 'lodash'
import classNames from 'classnames'

const projectTypes = [{
  val: 'visual_design',
  numericVal: 0,
  title: 'Visualize an app idea',
  desc: <p><strong>5-7 days,</strong> from <strong>$3,500</strong></p>,
  info: 'Wireframes, Visual Design'
}, {
  val: 'visual_prototype',
  numericVal: 1,
  title: 'Prototype an app',
  desc: <p><strong>14+ days,</strong> from <strong>$15,000</strong></p>,
  info: 'Visual or HTML prototype'
}, {
  val: 'app_dev',
  numericVal: 2,
  title: 'Fully develop an app',
  desc: <p>from <strong>$30,000 </strong></p>,
  info: 'Design, Front End, Back End, <br/>Integration and API'
}]

const getTypeIndex = (val) => _.findIndex(projectTypes, (t) => t.val === val)

class ProjectTypeSelector extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { type } = this.props
    // creating a function to render each type title + desc
    const itemFunc = (item, index) => {
      // handle active class
      const itemClassnames = classNames( 'selector', {
        active: type === item.val
      })
      const idx = getTypeIndex(item.val)
      return (
        <div
          className={itemClassnames} key={index}
          onClick={this.props.onSliderChange.bind(this, idx)}
        >
          <h3>{item.title}</h3>
          {item.desc}
        </div>
      )
    }

    // function to render item info
    const itemInfoFunc = (item, index) => {
      // handle active class
      const itemClassnames = classNames({active: type === item.val})
      const idx = getTypeIndex(item.val)
      return (
        <span
          onClick={this.props.onSliderChange.bind(this, idx)}
          className={itemClassnames}
          key={index}
          dangerouslySetInnerHTML={{__html: item.info}}>
        </span>
      )
    }

    return (
      /**
       * TODO Using onInput trigger instead of onChange.
       * onChange is showing some funky behavior at least in Chrome.
       * This functionality should be tested in other browsers
       */
      <div className="what-you-like-to-do">
        <h2>What would you like to do?</h2>
        <div className="type-selector">
          {projectTypes.map(itemFunc)}
        </div>

        <div className="range-slider">
          <input
            type="range"
            classNames="range-slider__range"
            min={0}
            max={2}
            value={getTypeIndex(this.props.type)}
            onInput={this.props.onSliderChange.bind(this)}
          />
          <p></p>
        </div>

        <div className="info-selector">
          {projectTypes.map(itemInfoFunc)}
        </div>
      </div>
    )
  }
}


ProjectTypeSelector.propTypes = {
  type: PropTypes.string.isRequired,
  mappedProjectType: PropTypes.number.isRequired
}
const actionCreators = {
  sliderChangeCreator: (modelName, val) => {
    return (dispatch) => {
      // get val from index
      dispatch(modelActions.change(modelName, projectTypes[val].val))
    }
  }
}

const mapStateToProps = ({newProject}) => ({
  type: newProject.type,
  mappedProjectType: _.findIndex(projectTypes, (t) => newProject.type === t.val),
})

// Merging props so that we can use determine the current
const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const props  = Object.assign({}, ownProps, stateProps, dispatchProps, {
    onSliderChange: (event) => {
      // handling case where event is fired by clicking on range or div.
      // the latter provides the index, the former an event
      const idx = (typeof event !== 'number') ? parseInt(event.target.value) : event
      props.sliderChangeCreator('newProject.type', idx)
    }
  })
  return props
}

export default connect(mapStateToProps, actionCreators, mergeProps)(ProjectTypeSelector)
