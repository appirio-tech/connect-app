import { getFreshToken } from 'tc-accounts'

export function jwt({ dispatch, getState }) {
  return (next) => (action) => {
    // only worry about expiring token for async actions
    console.log(dispatch)
    console.log(getState())
    if (typeof action === 'function') {
      return getFreshToken().then(() => next(action))
    }
    return next(action)
  }
}
