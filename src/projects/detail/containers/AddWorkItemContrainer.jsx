/**
 * AddWorkItemContrainer container
 * displays content of the workstreams list section
 *
 * NOTE data is loaded by the parent ProjectDetail component
 */
import React from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { updateTemplateIdForChallenge } from '../../../helpers/challenges'

import AddWorkItem from '../components/workstreams/AddWorkItem'
import {
  startLoadChallenges,
  loadChallenges,
  createWorkitem
} from '../../actions/works'


const AddWorkItemContrainer = (props) => (
  <AddWorkItem {...props} />
)

const mapStateToProps = ({ works, projectState, templates }) => {
  const productTemplates = _.get(templates, 'productTemplates', [])
  updateTemplateIdForChallenge(works.challenges, productTemplates)
  const challenges = _.get(works, 'challenges', [])
  const filterChallenges = _.cloneDeep(challenges)
  const workitems = _.get(works, 'workitems', [])
  for(const workitem of workitems) {
    const challengeId = _.get(workitem, 'details.challengeId', 0)
    _.remove(filterChallenges, {
      id: challengeId
    })
  }

  return {
    filterChallenges,
    challenges,
    isCreatingWorkItem: works.isCreatingWorkItem,
    errorWorkItem: !!works.errorWorkItem,
    allChallengesCount: _.get(works.challengeMetadata, 'allChallengesCount', 0),
    isLoadingChallenge: works.isLoadingChallenge,
    directProjectId: _.get(projectState, 'project.directProjectId', 0),
  }
}

const mapDispatchToProps = {
  startLoadChallenges,
  loadChallenges,
  createWorkitem
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AddWorkItemContrainer))
