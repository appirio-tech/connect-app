import { getFreshToken } from 'tc-accounts'

export function jwt({  }) {
  return (next) => (action) => {
    // only worry about expiring token for async actions
    if (typeof action === 'function') {
      return getFreshToken().then(() => next(action))
    }
    return next(action)
  }
}
