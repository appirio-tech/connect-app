import React from 'react'
import moment from 'moment'
import './FooterV2.scss'

const FooterV2 = () => (
  <div className="footer-v2">
    <ul className="footer-links">
      <li><a href="https://www.topcoder.com/company/" target="_blank">About</a></li>
      <li><a href="https://www.topcoder.com/contact-us/" target="_blank">Contact us</a></li>
      <li><a href="https://www.topcoder.com/community/how-it-works/privacy-policy/" target="_blank">Privacy</a></li>
      <li><a href="https://connect.topcoder.com/terms" target="_blank">Terms</a></li>
      <li><a href="https://www.topcoder.com/solutions/how-it-works/" target="_blank">Our Process</a></li>
    </ul>
    <div className="footer-copyright">
      © Topcoder { moment().format('YYYY') }
    </div>
  </div>
)

export default FooterV2
