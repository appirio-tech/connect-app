import { getFreshToken } from 'tc-accounts'

export function jwt({ dispatch, getState }) {
  return (next) => (action) => {
    // only worry about expiring token for async actions
    if (typeof action === 'function') {
      return getFreshToken().then((token)=> next(action))
    }
    return next(action)
  }
}
