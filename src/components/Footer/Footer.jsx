import React from 'react'
import { MenuBar } from 'appirio-tech-react-components'
import moment from 'moment'

require('./Footer.scss')

const Footer = ({domain}) => {
  const currentYear = moment().format('YYYY')
  const otherNavigationItems = [
    {img: '', text: 'About', link: 'https://www.' + domain + '/about'},
    {img: '', text: 'Contact', link: 'https://www.' + domain + '/contact-us'},
    {img: '', text: 'Help', link: 'https://help.' + domain, target:'_blank'},
    {img: '', text: 'Privacy', link: 'https://help.' + domain, target:'_blank'},
    {img: '', text: 'Terms', link: 'https://www.' + domain + '/community/how-it-works/terms/'}
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
