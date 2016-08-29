import React from 'react'

const Placeholder = ({ width = '16px', height = '16px' }) => {
  return (
    <svg width={width} height={height} viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg">
        {/* <!-- Generator: Sketch 39.1 (31720) - http://www.bohemiancoding.com/sketch --> */}
        <title>icon-definedfeature-placeholder</title>
        <desc>Created with Sketch.</desc>
        <defs></defs>
        <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g id="Settings-form-elements" transform="translate(-573.000000, -790.000000)" fill="#444444">
                <path d="M581.017812,795.00185 L583.99815,797.982188 L575.980338,806 L573,803.019662 L581.017812,795.00185 Z M585.984339,791.596237 L587.403261,793.015159 L584.990893,795.427527 L583.571972,794.008605 L585.984339,791.596237 Z M585.989457,799.031327 L588.9999,799.031327 L588.9999,797.024366 L585.989457,797.024366 L585.989457,799.031327 Z M585.229521,800.87141 L587.357904,802.999793 L585.938982,804.419718 L583.810599,802.290332 L585.229521,800.87141 Z M579.968572,793.010442 L581.975534,793.010442 L581.975534,790 L579.968572,790 L579.968572,793.010442 Z M576.005024,791.636276 L578.133407,793.764659 L576.714485,795.183581 L574.586102,793.055198 L576.005024,791.636276 Z" id="icon-definedfeature-placeholder"></path>
            </g>
        </g>
    </svg>
  )
}

const Generic = ({ width = '16px', height = '16px' }) => {
  return (
    <svg width={width} height={height} viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg">
        {/* <!-- Generator: Sketch 39.1 (31720) - http://www.bohemiancoding.com/sketch --> */}
        <title>icon-feature-placeholder</title>
        <desc>Created with Sketch.</desc>
        <defs></defs>
        <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g id="Settings-form-elements" transform="translate(-573.000000, -578.000000)" fill="#444444">
                <path d="M582,591.475 L582,585.675 L587,583.575 L587,589.375 L582,591.475 Z M575,583.475 L580,585.575 L580,591.375 L575,589.275 L575,583.475 Z M581,580.075 L585.5,581.975 L581,583.875 L576.5,581.975 L581,580.075 Z M588.4,581.075 L581.4,578.075 C581.1,577.975 580.9,577.975 580.6,578.075 L573.6,581.075 C573.2,581.175 573,581.575 573,581.975 L573,589.975 C573,590.375 573.2,590.775 573.6,590.875 L580.6,593.875 C580.7,593.975 580.9,593.975 581,593.975 C581.1,593.975 581.3,593.975 581.4,593.875 L588.4,590.875 C588.8,590.675 589,590.375 589,589.975 L589,581.975 C589,581.575 588.8,581.175 588.4,581.075 L588.4,581.075 Z" id="icon-feature-placeholder"></path>
            </g>
        </g>
    </svg>
  )
}

const FeatureIcons = {
  Placeholder,
  Generic
}

export default FeatureIcons
