import React from 'react'

const IconTextListNumbers = (props) => {
  const fill = props.fill || '#62AADC'
  const height = props.height || '16'
  const width = props.width || '16'

  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={height} width={width} viewBox="0 0 16 16" aria-labelledby="title">
      <title id="title">IconTextListNumbers</title>
        <path fill={fill} d="M5 1h11v2H5zM5 7h11v2H5zM5 13h11v2H5z"/>
        <path fill={fill} d="M.368 4v-.549l.598-.048c.097-.007.11-.035.11-.139V.84c0-.083-.02-.125-.09-.145L.382.569.46 0h1.666v3.264c0 .111.007.132.111.139l.57.048V4H.368zM.047 10v-.63l.907-.886c.684-.663.975-.934.975-1.32 0-.25-.122-.433-.48-.433-.373 0-.529.122-.529.603L0 7.252C.007 6.176.826 6 1.536 6c1.05 0 1.422.447 1.422 1.083 0 .636-.44 1.056-.934 1.53l-.765.73h.995c.067 0 .095-.013.108-.08l.095-.535h.717V10H.047zM2.344 13.682c.567.087.88.427.88 1.026 0 .88-.66 1.292-1.612 1.292C.939 16 .34 15.76 0 15.387l.533-.586c.253.247.533.44.999.44.373 0 .693-.133.693-.6 0-.406-.253-.573-.666-.573a2.73 2.73 0 0 0-.493.047v-.666l.326-.04c.48-.06.74-.293.74-.72 0-.252-.114-.459-.487-.459-.36 0-.532.12-.532.593l-.913-.08c0-1.052.793-1.232 1.492-1.232 1.026 0 1.419.393 1.419 1.106 0 .56-.347.912-.767 1.039v.026z"/>
    </svg>
  )
}

IconTextListNumbers.propTypes = {
  fill   : React.PropTypes.string,
  stroke : React.PropTypes.string,
  height : React.PropTypes.number,
  width  : React.PropTypes.number
}

export default IconTextListNumbers