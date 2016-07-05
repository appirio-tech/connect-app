import React from 'react'
import { MenuBar } from 'appirio-tech-react-components'
import moment from 'moment'

require('./Footer.scss')

const Footer = ({domain}) => {
  const currentYear = moment().format('YYYY')
  const otherNavigationItems = [
    {img: '', text: 'About', link: 'https://www.' + domain + '/about'},
    {img: '', text: 'Contacts', link: 'https://www.' + domain + '/contact-us'},
    {img: '', text: 'Terms of service', link: 'https://www.' + domain + '/community/how-it-works/terms/'},
    {img: '', text: 'Help', link: 'https://help.' + domain, target:'_blank'}
  ]

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
