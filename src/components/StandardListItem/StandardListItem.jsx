import {PropTypes } from 'react'
import React from 'react'

require('./StandardListItemStyles.scss')
 // showIcon: true -> render the icon
 // showLabel: true -> render the label
 // imgSrc: source for the icon
 // labelText: The text for the label
 // placeIcon: defines the position of the icon. Either: top | left | right.  Default to top

const StandardListItem = ({showIcon, showLabel, imgSrc, labelText, linkUrl, linkTarget='_self', placeIcon='top'}) => {
  const classes = 'StandardListItem transition ' + placeIcon
  let label
  let icon
  let item

  if (showLabel) {
    label = <p className="label">{labelText}</p>
  }

  if (showIcon) {
    icon = <img className="icon" src={imgSrc}/>
  }

  if (linkUrl) {
    item =
        <a className={classes} href={linkUrl} target={linkTarget}>{label}{icon}</a>
  } else {
    item = <div className={classes}>{label}{icon}</div>
  }

  return item
}

StandardListItem.propTypes = {
  showIcon   : PropTypes.bool,
  showLabel  : PropTypes.bool,
  imgSrc     : PropTypes.string,
  labelText  : PropTypes.node,
  linkUrl    : PropTypes.string,
  linkTarget : PropTypes.string,
  placeIcon  : PropTypes.string
}

StandardListItem.defaultProps = {
  showIcon    : true,
  showLabel   : true,
  linkTarget  : '_self',
  placeIcon   : 'top'
}

export default StandardListItem
