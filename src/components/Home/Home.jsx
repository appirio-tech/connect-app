import React from 'react'
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import './Home.scss'
import homeImgSrc from '../../assets/images/hero-tc-landing.png'
import { DOMAIN } from '../../config/constants'

class Home extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    // redirect to project list if user is logged in.
    document.title = 'Connect - Topcoder'
    if (this.props.isLoggedIn)
      this.props.history.push('/projects')
  }

  render() {
    const learnMoreUrl = 'https://www.' + DOMAIN +'/about-topcoder/connect/'
    return (
      <div className="content content-home">
        <div className="container">
          <div className="h1-mobile">Topcoder Connect: the easiest way to go from idea to app</div>
          <div className="image-container">
            <img src={homeImgSrc} alt="" />
          </div>
          <div className="content-container">
            <h1>Topcoder Connect: the easiest way to go from idea to app</h1>
            <p>Companies and agencies, from the world’s largest to the Valley’s newest, use crowdsourcing to deliver high-quality assets, faster.</p>
            <p>Connect guides you through the entire crowdsourcing process, from entering requirements to receiving final deliverables, and it facilitates collaboration between your project team and Topcoder community members working on your project.</p>
            <div className="button-bar">
              <Link to="/new-project" className="tc-btn tc-btn-primary">Start a project</Link>
              <a href={ learnMoreUrl } className="tc-link">Learn more about Connect</a>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({loadUser}) => {
  return {
    isLoggedIn: loadUser.isLoggedIn
  }
}

export default withRouter(connect(mapStateToProps)(Home))
