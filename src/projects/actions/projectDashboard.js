import _ from 'lodash'
import { loadMembers } from '../../actions/members'
import { loadProject, loadProjectInvite, loadDirectProjectData, loadProjectPhasesWithProducts } from './project'
import { loadProjectsMetadata } from '../../actions/templates'
import { loadProductTimelineWithMilestones } from './productsTimelines'
import { loadFeedsForPhases } from './phasesTopics'
import { LOAD_PROJECT_DASHBOARD,
  LOAD_ADDITIONAL_PROJECT_DATA,
  DISCOURSE_BOT_USERID,
  CODER_BOT_USERID,
  TC_SYSTEM_USERID
} from '../../config/constants'

/**
 * Load all project data to paint the dashboard
 *
 * @param {Function} dispatch  dispatches redux actions
 * @param {Function} getState  returns redux state
 * @param {Number}   projectId project id
 *
 * @return {Promise} LOAD_ADDITIONAL_PROJECT_DATA action
 */
const getDashboardData = (dispatch, getState, projectId, isOnlyLoadProjectInfo) => {
  const { productTemplates } = getState().templates
  return dispatch(loadProject(projectId))
    .then(({ value: project }) => {
      let userIds = _.map(project.members, 'userId')
      userIds = _.union(userIds, _.map(project.invites, 'userId'))

      // this is to remove any nulls from the list (dev had some bad data)
      _.remove(userIds, i => !i)
      // load additional data in parallel
      let promises = [
        dispatch(loadMembers(userIds))
      ]
      if (isOnlyLoadProjectInfo) {
        promises = []
      }

      if (project.directProjectId && !isOnlyLoadProjectInfo) {
        promises.push(dispatch(loadDirectProjectData(project.directProjectId)))
      }

      // for new projects load phases, products, project template and product templates
      if (project.version === 'v3') {
        promises.push(
          dispatch(loadProjectPhasesWithProducts(projectId))
            .then(({ value: phases }) => {
              loadFeedsForPhases(projectId, phases, dispatch)
              .then((phaseFeeds) => {
                console.log(phaseFeeds)
                let userIds = []
                _.forEach(phaseFeeds, phaseFeed => {
                  userIds = _.union(userIds, _.map(phaseFeed.topics, 'userId'))
                  _.forEach(phaseFeed.topics, topic => {
                    userIds = _.union(userIds, _.map(topic.posts, 'userId'))
                  })
                  // this is to remove any nulls from the list (dev had some bad data)
                  _.remove(userIds, i => !i || [DISCOURSE_BOT_USERID, CODER_BOT_USERID, TC_SYSTEM_USERID].indexOf(i) > -1)
                });

                dispatch(loadMembers(userIds))
              })
              // load timelines for phase products here together with all dashboard data
              // as we need to know timeline data not only inside timeline container
              loadTimelinesForPhasesProducts(phases, dispatch)
            })
        )
      }

      if (!productTemplates) {
        promises.push(dispatch(loadProjectsMetadata()))
      }

      return dispatch({
        type: LOAD_ADDITIONAL_PROJECT_DATA,
        payload: Promise.all(promises)
      })

    })
}

/**
 * Load project data and project invite
 *
 * @param {Function} dispatch  dispatches redux actions
 * @param {Function} getState  returns redux state
 * @param {Number}   projectId project id
 *
 * @return {Promise} LOAD_ADDITIONAL_PROJECT_DATA action
 */
const getData = (dispatch, getState, projectId, isOnlyLoadProjectInfo) => {
  return dispatch(loadProjectInvite(projectId))
    .then(() => getDashboardData(dispatch, getState, projectId, isOnlyLoadProjectInfo))
    .catch(() => getDashboardData(dispatch, getState, projectId, isOnlyLoadProjectInfo))
}

/**
 * Load timelines for phase's products
 *
 * @param {Array}   phases    list of phases
 * @param {Function} dispatch dispatch function
 */
function loadTimelinesForPhasesProducts(phases, dispatch) {
  const products = []

  phases.forEach((phase) => {
    phase.products.forEach((product) => {
      products.push(product)
    })
  })

  return Promise.all(
    products.map((product) => dispatch(loadProductTimelineWithMilestones(product.id)))
  )
}

export function loadProjectDashboard(projectId, isOnlyLoadProjectInfo = false) {
  return (dispatch, getState) => {
    return dispatch({
      type: LOAD_PROJECT_DASHBOARD,
      payload: Promise.all([getData(dispatch, getState, projectId, isOnlyLoadProjectInfo)])
    })
  }
}
