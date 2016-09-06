import React, {PropTypes} from 'react'
import './PageError.scss'

const getMessage = code => {
  switch(code) {
  case 404:
    return 'D’oh! We couldn’t find the page you were looking for.'
  case 500:
  default:
    return 'D’oh! Something went wrong'
  }
}

const PageError = ({code}) => {
  return (
    <section className="content content-error">
      <div className="container">
        <div className="page-error">
          <h3>{getMessage(code)}</h3>
          <p>Sorry about that, mate! Please try reloading the page again. If things don’t work or you’re sure it is Coder’s fault, send us a note at <a href="support@topcoder.com">support@topcoder.com</a> and we’ll fix it for you.</p>
          <span>{code}</span>
        </div>
      </div>
    </section>
  )
}

PageError.propTypes = {
  code: PropTypes.number.isRequired
}
PageError.defaultProps = {
  code: 500
}
export default PageError
