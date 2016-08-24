import React from 'react'
import { MenuBar } from 'appirio-tech-react-components'
import moment from 'moment'

require('./Footer.scss')

const Footer = ({domain}) => {
  const currentYear = moment().format('YYYY')
  const otherNavigationItems = [
    {img: '', text: 'About', link: 'https://www.' + domain + '/about-topcoder/'},
    {img: '', text: 'Contact', link: 'https://www.' + domain + '/about-topcoder/contact/'},
    {img: '', text: 'Terms of service', link: 'https://www.' + domain + '/community/how-it-works/terms/'},
    {img: '', text: 'Help & Support', link: 'https://help.' + domain, target:'_blank'}
  ]

  return (
    <div className="Footer">
      <p className="copyright-notice">© {currentYear} Topcoder. All Rights Reserved.</p>
      <div className="footer-menu">
        <MenuBar items={otherNavigationItems} orientation="horizontal" mobileBreakPoint={767} />
      </div>
    </div>
  )
}

export default Footer
