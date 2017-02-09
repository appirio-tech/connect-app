
/**
 * A hack honestly, but using this to bridge redux-promise-middleware &&
 * redux-segment. The latter fires a tracking event for both
 * Pending & Success / Failure events without this work-around
 */
export default function segmentPromiseHelper() {
  return next => action => {
    const { type, meta } = action
    if (meta && meta.onSuccessAnalytics && /.*_SUCCESS/.test(type)) {
      meta.analytics = meta.onSuccessAnalytics
    }
    return next(action)
  }
}
