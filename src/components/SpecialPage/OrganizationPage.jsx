import React from 'react'
import { Link } from 'react-router-dom'
import './OrganizationPage.scss'

const OrganizationPage = () => {
  return (
    <div className="special-page-link">
      <Link
        to="/new-project/app" className="tc-btn tc-btn-sm tc-btn-primary"
      >Link to app</Link>
      <Link
        to="/new-project/all-websites" className="tc-btn tc-btn-sm tc-btn-primary"
      >Link to all websites</Link>
      <Link
        to="/new-project/generic-design" className="tc-btn tc-btn-sm tc-btn-primary"
      >Link to generic design</Link>
    </div>
  )
}

OrganizationPage.propTypes = {
}

export default OrganizationPage
