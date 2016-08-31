import _ from 'lodash'
import React, { PropTypes } from 'react'
import seeAttachedWrapperField from './SeeAttachedWrapperField'
import FlattenedFeatureList from '../../FeatureSelector/FlattenedFeatureList'

require('./SpecFeatureQuestion.scss')

const SpecFeatureQuestion = ({ project, question, showFeaturesDialog}) => {
  return (
    <div className="add-edit-features">
      <div className="add-edit-features__added-features">
        <FlattenedFeatureList addedFeatures={ _.get(project, question.fieldName, []) } />
      </div>
      <div className="add-edit-features__header">
        <button type="button" onClick={ showFeaturesDialog } className="tc-btn-secondary tc-btn-sm">Add / Edit Features</button>
      </div>
    </div>
  )
}

export default SpecFeatureQuestion