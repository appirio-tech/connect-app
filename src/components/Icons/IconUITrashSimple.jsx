import React from 'react'

const IconUITrashSimple = (props) => {
  const height = props.height || '16'
  const width = props.width || '16'

  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={height} width={width} viewBox="0 0 16 16" aria-labelledby="title">
      <title id="title">IconUITrashSimple</title>
        <path d="M5 7h2v6H5zM9 7h2v6H9z"/><path d="M12 1a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v2H0v2h1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V5h1V3h-4V1zM6 2h4v1H6V2zm7 3v9H3V5h10z"/>
    </svg>
  )
}

IconUITrashSimple.propTypes = {
  fill   : React.PropTypes.string,
  stroke : React.PropTypes.string,
  height : React.PropTypes.number,
  width  : React.PropTypes.number
}

export default IconUITrashSimple