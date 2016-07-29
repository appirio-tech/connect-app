function apiMiddleware({ dispatch, getState }) {
  return next => action => {
    console.log(dispatch)
    console.log(next)
    const {
      API_CALL
      // payload = {}
    } = action
    if (!API_CALL) {
      return //next(action)
    }

    // const config = action[API_CALL]
    const {
      api,
      method,
      args,
      success,
      failure
    } = API_CALL
    if (!api || typeof api[method] !== 'function') {
      // next(action)
      return
    }

    // TODO check if token has expired
    if (api.requiresAuth(method) && !api.getToken()) {
      if (!getState().loadUser.user) {
        // TODO throw error
        return
      }
      api.setToken(getState().loadUser.user.token)
    }

    const callApi = api[method]
    return callApi(...args).then(success).catch(failure)

  }
}

export default apiMiddleware
