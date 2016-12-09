import React from 'react'
import { MenuBar } from 'appirio-tech-react-components'
import moment from 'moment'

require('./Footer.scss')

const Footer = () => {
  const currentYear = moment().format('YYYY')
  const otherNavigationItems = [
    {img: '', text: 'About', link: 'https://www.topcoder.com/about-topcoder/', target: '_blank'},
    {img: '', text: 'Contact', link: 'https://www.topcoder.com/about-topcoder/contact/', target: '_blank'},
    {img: '', text: 'Help', link: 'https://help.topcoder.com/hc/en-us/articles/225540188-Topcoder-Connect-FAQs', target: '_blank'},
    {img: '', text: 'Privacy', link: 'https://www.topcoder.com/community/how-it-works/privacy-policy/', target: '_blank'},
    {img: '', text: 'Terms', link: 'https://connect.topcoder.com/terms'}
  ]
  const isProjectDetails = /projects\/\d+/.test(window.location.pathname)

  if (isProjectDetails) {
    return null
  }

  return (
    <div className="Footer">
      <p className="copyright-notice">Created by © Topcoder, All Rights Reserved {currentYear}</p>
      <div className="footer-menu">
        <MenuBar items={otherNavigationItems} orientation="horizontal" mobileBreakPoint={767} />
      </div>
    </div>
  )
}

export default Footer
