import { branch, renderComponent } from 'recompose'
import LoadingIndicator from './LoadingIndicator/LoadingIndicator'
const identity = t => t

// `hasLoaded()` is a function that returns whether or not the the component
// has all the props it needs
const spinnerWhileLoading = hasLoaded =>
  branch(
    hasLoaded,
    identity,
    renderComponent(LoadingIndicator)
  )

export default spinnerWhileLoading
