import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from './SampleSubCSSModule.m.scss';

export const SampleSubCSSModule = () => (
  <div styleName="sample-sub-css-module">
    <div styleName="square">
      sub component, by default it has 200x200, but parent component overrides it
    </div>
  </div>
);

SampleSubCSSModule.propTypes = {
};

export default CSSModules(SampleSubCSSModule, styles);
