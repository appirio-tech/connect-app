import React from 'react'

const IconTcTextUnderline = (props) => {
  const fill = props.fill || '#62AADC'
  const height = props.height || '16'
  const width = props.width || '16'

  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={height} width={width} viewBox="0 0 16 16" aria-labelledby="title">
      <title id="title">IconTcTextUnderline</title>
      <path fill={fill} d="M8.825 12.124c2.74 0 4.986-1.47 4.986-5.844V1.32l1.28-.2V0H10.67v1.12l1.486.2.017 4.968c.008 3.254-1.093 4.632-3.014 4.632-1.75 0-3.339-.739-3.339-4.258V1.303l1.477-.182V0H2.03v1.12l1.349.183C3.369 3.362 3.36 4.545 3.36 6.57c-.017 3.694 1.614 5.554 5.465 5.554zM1 14h14.4v2H1z"/>
    </svg>
  )
}

IconTcTextUnderline.propTypes = {
  fill   : React.PropTypes.string,
  stroke : React.PropTypes.string,
  height : React.PropTypes.number,
  width  : React.PropTypes.number
}

export default IconTcTextUnderline