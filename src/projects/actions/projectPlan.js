import _ from 'lodash'
import { loadMembers } from '../../actions/members'
import { loadProjectPhasesWithProducts } from './project'
import { loadFeedsForPhases } from './phasesTopics'
import { loadProductTimelineWithMilestones } from './productsTimelines'
import { LOAD_PROJECT_PLAN } from '../../config/constants'
import {
  DISCOURSE_BOT_USERID,
  CODER_BOT_USERID,
  TC_SYSTEM_USERID
} from '../../config/constants'


/**
 * Load timelines for phase's products
 *
 * @param {Array}   phases    list of phases
 * @param {Function} dispatch dispatch function
 *
 * @return {Promise} Combine of list promise for load product timeline
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

/**
 * Load project plan data
 * @param {Object} project project object
 * @param {Function} dispatch  dispatches redux actions
 *
 * @return {Function} dispatch function
 */
function getData(project, dispatch) {
  if (project.version !== 'v3') {
    // returns empty resolved promise to avoid error when we call then on this action
    return Promise.resolve()
  }

  let existingUserIds = _.map(project.members, 'userId')
  existingUserIds = _.union(existingUserIds, _.map(project.invites, 'userId'))

  // this is to remove any nulls from the list (dev had some bad data)
  _.remove(existingUserIds, i => !i)

  return dispatch(loadProjectPhasesWithProducts(project.id))
    .then(({ value: phases }) => {
      loadFeedsForPhases(project.id, phases, dispatch)
        .then((phaseFeeds) => {
          let phaseUserIds = []
          _.forEach(phaseFeeds, phaseFeed => {
            phaseUserIds = _.union(phaseUserIds, _.map(phaseFeed.topics, 'userId'))
            _.forEach(phaseFeed.topics, topic => {
              phaseUserIds = _.union(phaseUserIds, _.map(topic.posts, 'userId'))
            })
            // this is to remove any nulls from the list (dev had some bad data)
            _.remove(phaseUserIds, i => !i || [DISCOURSE_BOT_USERID, CODER_BOT_USERID, TC_SYSTEM_USERID].indexOf(i) > -1)
          })
          // take difference of existingUserIds identified from project members
          phaseUserIds = _.difference(phaseUserIds, existingUserIds)

          dispatch(loadMembers(phaseUserIds))
        })
      // load timelines for phase products here together with all dashboard data
      // as we need to know timeline data not only inside timeline container
      loadTimelinesForPhasesProducts(phases, dispatch)
    })
}

/**
 * Load project plan
 * @param {Object} project project object
 *
 * @return {Function} dispatch function
 */
export function loadProjectPlan(project) {
  return (dispatch) => {
    return dispatch({
      type: LOAD_PROJECT_PLAN,
      payload: Promise.all([getData(project, dispatch)])
    })
  }
}
