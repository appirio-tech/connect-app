import React, { PropTypes } from 'react'
import CSSModules from 'react-css-modules'
import styles from './SampleCSSModule.m.scss'
import stylesOverride from './OverrideSubComponent.m.scss'
import SampleSubCSSModule from '../SampleSubCSSModule'

export const SampleCSSModule = () => (
  <div styleName="sample-css-module">
    <div styleName="square">
      square
    </div>
    <SampleSubCSSModule styles={stylesOverride} />
  </div>
)

SampleCSSModule.propTypes = {
}

export default CSSModules(SampleCSSModule, styles)
