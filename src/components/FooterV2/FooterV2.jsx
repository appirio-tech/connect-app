import React from 'react'
import moment from 'moment'
import './FooterV2.scss'

const FooterV2 = () => (
  <div className="footer-v2">
    <ul className="footer-links">
      <li><a href="https://www.topcoder.com/about-topcoder/" target="_blank">About</a></li>
      <li><a href="https://www.topcoder.com/about-topcoder/contact/" target="_blank">Contact</a></li>
      <li><a href="https://help.topcoder.com/hc/en-us/articles/225540188-Topcoder-Connect-FAQs" target="_blank">Help</a></li>
      <li><a href="https://www.topcoder.com/community/how-it-works/privacy-policy/" target="_blank">Privacy</a></li>
      <li><a href="https://connect.topcoder.com/terms">Terms</a></li>
    </ul>
    <div className="footer-copyright">
      Topcoder © { moment().format('YYYY') }.
    </div>
  </div>
)

export default FooterV2
