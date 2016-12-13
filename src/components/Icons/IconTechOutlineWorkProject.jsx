import React from 'react'

const IconTechOutlineWorkProject = (props) => {
  const stroke = props.stroke || '#262628'
  const height = props.height || '48'
  const width = props.width || '48'

  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={height} width={width} viewBox="0 0 48 48" aria-labelledby="title">
      <title id="title">IconTechOutlineWorkProject</title>
        <g  transform="translate(0, 0)">
          <polyline data-cap="butt" fill="none" stroke={stroke} stroke-width="2" stroke-miterlimit="10" points="38,14 44,20 40,24 34,18" stroke-linejoin="miter" stroke-linecap="butt"/>
          <path fill="none" stroke={stroke} stroke-width="2" stroke-linecap="square" stroke-miterlimit="10" d="M18,30H4c0,0,1.8,8,14,8" stroke-linejoin="miter"/>
          <path fill="none" stroke={stroke} stroke-width="2" stroke-linecap="square" stroke-miterlimit="10" d="M46,40V30H18v16h22 C40,42.7,42.7,40,46,40z" stroke-linejoin="miter"/>
          <rect x="24.5" y="8.8" transform="matrix(0.7071 -0.7071 0.7071 0.7071 0.4731 27.1421)" fill="none" stroke={stroke} stroke-width="2" stroke-linecap="square" stroke-miterlimit="10" width="17" height="8.5" stroke-linejoin="miter"/>
          <line data-color="color-2" fill="none" stroke={stroke} stroke-width="2" stroke-linecap="square" stroke-miterlimit="10" x1="14" y1="24" x2="10" y2="24" stroke-linejoin="miter"/>
          <line data-color="color-2" fill="none" stroke={stroke} stroke-width="2" stroke-linecap="square" stroke-miterlimit="10" x1="16.3" y1="18.3" x2="13.5" y2="15.5" stroke-linejoin="miter"/>
        </g>
      </svg>
  )
}

IconTechOutlineWorkProject.propTypes = {
  stroke : React.PropTypes.string,
  height : React.PropTypes.number,
  width  : React.PropTypes.number
}

export default IconTechOutlineWorkProject