import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from './<%= pascalEntityName %>.m.scss';

export const <%= pascalEntityName %> = () => (
  <div styleName="<%= dashesEntityName %>">
  </div>
);

<%= pascalEntityName %>.propTypes = {
  foo: PropTypes.string.isRequired,
};

export default CSSModules(<%= pascalEntityName %>, styles);
