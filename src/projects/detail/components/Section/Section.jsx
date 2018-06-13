/**
 * Section component
 * which can be used together with SectionTitle to show title
 */
import React from 'react'
import PT from 'prop-types'

import './Section.scss'

const Section = ({
  children,
}) => (
  <section styleName="section">{children}</section>
)

Section.propTypes = {
  children: PT.node.isRequired,
}

export default Section
