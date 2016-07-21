
import {
  LOAD_PROJECT,
  PROJECT_LOAD_SUCCESS,
  PROJECT_LOAD_FAILURE
} from '../../config/constants'

export function loadProject(projectId) {
  return ((dispatch, getState) => {
    const state = getState()
    const currentProject = state.currentProject
    // check if project is being loaded or was loaded recently
    const now = new Date().getTime()
    if (currentProject.projectId === projectId &&
      (now - currentProject.lastUpdated.getTime() < 3000
      || currentProject.isLoading)
    ) {
      // project is already loaded or is loading so dont dispatch
      return
    }
    dispatch({
      type: LOAD_PROJECT,
      projectId
    })

    Promise.resolve(
      setTimeout(() => {
        dispatch({
          type: PROJECT_LOAD_SUCCESS,
          project: {
            createdAt: '2016-07-20T23:09:45.000Z',
            updatedAt: '2016-07-20T23:09:45.000Z',
            terms: [],
            id: 4,
            billingAccountId: '1',
            title: 'test1',
            description: 'test project',
            type: 'design',
            details: {
              features: [{
                id: null,
                title: 'feature1',
                description: 'desc1',
                notes: 'explanation1',
                custom: true,
                fileIds: []
              }, {
                id: '121',
                title: 'feature2',
                description: 'desc2',
                notes: '',
                custom: false,
                fileIds: [
                  '123456'
                ]
              }],
              designNotes: 'my design'
            },
            createdBy: 40135978,
            updatedBy: 40135978,
            challengeEligibility: [],
            external: null,
            status: 'draft',
            members: [{
              createdAt: '2016-07-20T23:09:45.000Z',
              updatedAt: '2016-07-20T23:09:45.000Z',
              id: 5,
              isPrimary: true,
              role: 'customer',
              userId: 40135978,
              updatedBy: 40135978,
              createdBy: 40135978,
              projectId: 4
            }],
            directProjectId: null,
            estimatedPrice: null,
            actualPrice: null
          }
        })
      }, 3000)
    )

  })
}

export function projectLoadSuccess(dispatch) {
  dispatch({
    type: PROJECT_LOAD_SUCCESS
  })
}

export function projectLoadFailure(dispatch) {
  dispatch({
    type: PROJECT_LOAD_FAILURE
  })
}
