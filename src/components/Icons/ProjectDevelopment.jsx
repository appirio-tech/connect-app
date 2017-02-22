// TODO: Modify this component to use .svg icons instead of .png assets.
// FIXME: This is wrong. We need to load only one .SVG in the main component. All states should be handled by CSS transformations only!


import React from 'react'
import Black from '../../assets/images/product-code.svg'
import Blue from '../../assets/images/product-code.svg'

function ProjectDevelopment(props) {
  const i = props.color === 'black' ? Black : Blue
  const s = props.size
  return (
    <img className="Icon ProjectDevelopment" src={i} width={s} />
  )
}

export default ProjectDevelopment
