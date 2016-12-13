import React from 'react'

const IconTechOutlineWatchAndroid = (props) => {
  const fill = props.fill || '#62AADC'
  const height = props.height || '48'
  const width = props.width || '48'

  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={height} width={width} viewBox="0 0 48 48" aria-labelledby="title">
      <title id="title">IconTechOutlineWatchAndroid</title>
        <path fill={fill} d="M11.2 37.1l1.8 9.1c.1.5.5.8 1 .8h16c.5 0 .9-.3 1-.8l1.8-9.1c2.5-2.1 4.5-4.9 5.5-8.1H42c.6 0 1-.4 1-1v-8c0-.6-.4-1-1-1h-3.8c-1-3.2-2.9-6-5.5-8.1L31 1.8c-.1-.5-.5-.8-1-.8H14c-.5 0-.9.3-1 .8l-1.8 9.1C7.4 14 5 18.7 5 24s2.4 10 6.2 13.1zm18 7.9H14.8l-1.3-6.3c2.5 1.4 5.4 2.3 8.4 2.3 3.1 0 5.9-.8 8.4-2.3L29.2 45zM41 21v6h-2.3c.2-1 .3-2 .3-3s-.1-2-.3-3H41zM14.8 3h14.4l1.3 6.3C27.9 7.8 25.1 7 22 7s-5.9.8-8.4 2.3L14.8 3zM22 9c8.3 0 15 6.7 15 15s-6.7 15-15 15c-3.5 0-6.7-1.2-9.3-3.2 0 0-.1-.1-.2-.1C9.2 32.9 7 28.7 7 24c0-8.3 6.7-15 15-15z"/><path d="M22 25h6c.6 0 1-.4 1-1s-.4-1-1-1h-5v-5c0-.6-.4-1-1-1s-1 .4-1 1v6c0 .6.4 1 1 1z"/>
      </svg>
  )
}

IconTechOutlineWatchAndroid.propTypes = {
  fill   : React.PropTypes.string,
  stroke : React.PropTypes.string,
  height : React.PropTypes.number,
  width  : React.PropTypes.number
}

export default IconTechOutlineWatchAndroid