import React from 'react'

function ProjectAppVisualDesign(props) {
  const s = props.size
  return (
    <svg className="Icon ProjectAppVisualDesign" width={s} height={s} viewBox="0 0 64 56">
      <g fill="none" stroke={props.color} strokeWidth="2" strokeMiterlimit="10">
        <path d="M39 47v8M27 55v-8M24 55h18M24 39h22M32 43h2M5 20V5h54v23M21 5v15M5 15h54M33 5v30"/>
        <path d="M45 5v30H24M46 47H24"/><path d="M1 20V2a1 1 0 0 1 1-1h60a1 1 0 0 1 1 1v26"/>
        <path d="M21 47H1M21 54a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V24a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v30zM9 27v20M1 33h20"/>
        <path d="M1 27h20M63 54a1 1 0 0 1-1 1H50a1 1 0 0 1-1-1V32a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v22zM52 47h8M49 51h14M8 51h6M52 39h8M52 43h8M49 35h14"/>
      </g>
    </svg>
  )
}

export default ProjectAppVisualDesign
