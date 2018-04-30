/**
 * Enables scrolling to anchor links inside component
 *
 * The idea is, that many components are not mounted from the beginning due to data loading etc
 * So we wrap such components with this HOC.
 * As soon as component mounted we check if window location has any hash.
 * If there is any hash we check if component has element with such id and scroll to it.
 */
import React from 'react'
import { SCROLL_TO_MARGIN, SCROLL_TO_DURATION } from '../config/constants'
import { scroller } from 'react-scroll'

/**
 * Scrolls to the element by hash
 *
 * @param  {String} hash hash
 */
export function scrollToHash(hash) {
  const id = hash.replace('#', '')
  const windowWidth = window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth

  scroller.scrollTo(id, {
    spy: true,
    smooth: true,
    offset: windowWidth < 768 ? 0 : -SCROLL_TO_MARGIN,
    duration: SCROLL_TO_DURATION,
    activeClass: 'active'
  })
}

/**
 * HOC
 *
 * @param  {Mixed} Component react component
 *
 * @return {Object}          wrapped react component
 */
export function scrollToAnchors(Component) {

  class ScrollToAnchorsComponent extends React.Component {
    componentDidMount() {
      const { hash } = window.location

      if (hash !== '') {
        // Push onto callback queue so it runs after the DOM is updated,
        // this is required when navigating from a different page so that
        // the element is rendered on the page before trying to getElementById.
        setTimeout(() => scrollToHash(hash), 0)
      }
    }

    render() {
      return <Component { ...this.props}/>
    }
  }

  return ScrollToAnchorsComponent
}
