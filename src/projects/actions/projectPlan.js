import _ from 'lodash'
import { loadMembers } from '../../actions/members'
import { loadProjectPhasesWithProducts } from './project'
import { loadFeedsForPhases } from './phasesTopics'
import { loadProductTimelineWithMilestones } from './productsTimelines'
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

export function loadProjectPlan(projectId, existingUserIds) {
  return (dispatch) => {
    return dispatch(loadProjectPhasesWithProducts(projectId))
      .then(({ value: phases }) => {
        loadFeedsForPhases(projectId, phases, dispatch)
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
}
