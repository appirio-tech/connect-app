import React from 'react'

const IconTechOutlineWatchApple = (props) => {
  const fill = props.fill || '#62AADC'
  const height = props.height || '48'
  const width = props.width || '48'

  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={height} width={width} viewBox="0 0 48 48" aria-labelledby="title">
      <title id="title">IconTechOutlineWatchApple</title>
        <path fill={fill} d="M11.2 38.9l1.8 7.3c.1.4.5.8 1 .8h16c.5 0 .9-.3 1-.8l1.8-7.3c2.4-.4 4.2-2.4 4.2-4.9v-5h3c.6 0 1-.4 1-1v-8c0-.6-.4-1-1-1h-3v-5c0-2.5-1.8-4.5-4.2-4.9L31 1.8c-.1-.5-.5-.8-1-.8H14c-.5 0-.9.3-1 .8l-1.8 7.3C8.8 9.5 7 11.5 7 14v20c0 2.5 1.8 4.5 4.2 4.9zm18 6.1H14.8l-1.5-6h17.4l-1.5 6zM39 21v6h-2v-6h2zM14.8 3h14.4l1.5 6H13.3l1.5-6zM9 14c0-1.7 1.3-3 3-3h20c1.7 0 3 1.3 3 3v20c0 1.7-1.3 3-3 3H12c-1.7 0-3-1.3-3-3V14z"/><path d="M22 25h6c.6 0 1-.4 1-1s-.4-1-1-1h-5v-5c0-.6-.4-1-1-1s-1 .4-1 1v6c0 .6.4 1 1 1z"/>
      </svg>
  )
}

IconTechOutlineWatchApple.propTypes = {
  fill   : React.PropTypes.string,
  stroke : React.PropTypes.string,
  height : React.PropTypes.number,
  width  : React.PropTypes.number
}

export default IconTechOutlineWatchApple