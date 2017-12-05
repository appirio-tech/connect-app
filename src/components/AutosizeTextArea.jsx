import React, { Component } from 'react'
import { TCFormFields } from 'appirio-tech-react-components'

/**
 * This wrapper component is for fixing the resize issue of `TCFormFields.Textarea` in `appirio-tech-react-components`
 * It would be better to fix the original package if someone has access to that repo.
 */
export default class AutosizeTextArea extends Component {
  mount(component) {
    if (component){
      setTimeout(() => component && component.forceUpdate(), 0)
    }
  }

  render() {
    return <TCFormFields.Textarea autoResize ref={this.mount} {...this.props} />
  }
}