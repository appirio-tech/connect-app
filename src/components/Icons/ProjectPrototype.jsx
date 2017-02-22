// TODO: Modify this component to use .svg icons instead of .png assets.
// FIXME: This is wrong. We need to load only one .SVG in the main component. All states should be handled by CSS transformations only!


import React from 'react'
import Icon from '../../assets/images/product-prototype.svg'
// import Blue from '../../assets/images/icon-project-prototype-blue.png'

function ProjectPrototype(props) {
  const state = props.color === 'black' ? 'normal' : 'selected'
  const s = props.size
  return (
    <img className={state + 'Icon ProjectPrototype'} src={Icon} width={s} />
  )
}

export default ProjectPrototype
