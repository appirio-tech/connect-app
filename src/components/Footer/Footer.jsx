import React from 'react'
import MenuBar from 'appirio-tech-react-components/components/MenuBar/MenuBar'
import moment from 'moment'
import MediaQuery from 'react-responsive'
import FooterV2 from '../FooterV2/FooterV2'
import { NEW_PROJECT_PATH } from '../../config/constants'

require('./Footer.scss')

const Footer = () => {
  const currentYear = moment().format('YYYY')
  const otherNavigationItems = [
    {img: '', text: 'About', link: 'https://www.topcoder.com/about-topcoder/', target: '_blank'},
    {img: '', text: 'Contact us', link: 'https://www.topcoder.com/about-topcoder/contact/', target: '_blank'},
    {img: '', text: 'Privacy', link: 'https://www.topcoder.com/community/how-it-works/privacy-policy/', target: '_blank'},
    {img: '', text: 'Terms', link: 'https://connect.topcoder.com/terms', target: '_blank'}
  ]
  const isProjectDetails = /projects\/\d+/.test(window.location.pathname)
  const isCreateProject = window.location.pathname.startsWith(NEW_PROJECT_PATH)
  const isNotificationsPage = window.location.pathname.startsWith('/notifications')

  // TODO this looks like a bad way of doing it, I think it should be re-factored
  const shouldHideOnDesktop = isProjectDetails || isCreateProject || isNotificationsPage
  const shouldHideOnMobile =  isCreateProject || isNotificationsPage

  return (
    <MediaQuery minWidth={768}>
      {(matches) => {
        if (matches) {
          return (shouldHideOnDesktop ? null :
            <div className="Footer">
              <p className="copyright-notice">© Topcoder { currentYear }</p>
              <div className="footer-menu">
                <MenuBar items={otherNavigationItems} orientation="horizontal" mobileBreakPoint={767} />
              </div>
            </div>
          )
        } else {
          return (shouldHideOnMobile ? null :
            <FooterV2 />
          )
        }
      }}
    </MediaQuery>
  )
}

export default Footer
