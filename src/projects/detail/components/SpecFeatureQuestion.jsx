import React, { Component } from 'react'
import PropTypes from 'prop-types'
import FlattenedFeatureList from './FeatureSelector/FlattenedFeatureList'

require('./SpecFeatureQuestion.scss')

class SpecFeatureQuestion extends Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { value, showFeaturesDialog, isDisabled } = this.props
    return (
      <div className="add-edit-features">
        <div className="add-edit-features__added-features">
          <FlattenedFeatureList addedFeatures={ value } />
        </div>
        <div className="add-edit-features__header">
          <button type="button" onClick={ showFeaturesDialog } disabled={ isDisabled } className="tc-btn-secondary tc-btn-sm">Add / Edit Features</button>
        </div>
      </div>
    )
  }
}

SpecFeatureQuestion.defaultProps = {
  value: []
}

SpecFeatureQuestion.propTypes = {
  value: PropTypes.arrayOf(PropTypes.object).isRequired,
  question: PropTypes.object.isRequired,
  resetValue: PropTypes.func.isRequired,
  showFeaturesDialog: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool.isRequired
}

export default SpecFeatureQuestion
